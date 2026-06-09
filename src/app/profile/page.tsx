"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "../component/layout/app-shell";
import { ProfileHero, type ProfileHeroData } from "../component/profile/profile-hero";
// ProfileActivity removed per request (not needed)
import { ProfileProjects } from "../component/profile/profile-projects";
import dynamic from "next/dynamic";
import { AuthService } from "@/services/auth.service";
import { CompanyService } from "@/services/company.service";
import { ProjectService } from "@/services/project.service";
import { PywService } from "@/services/pyw.service";
import type { Project } from "@/types/project";
import type { Pyw } from "@/types/pyw";
import { ProfilePyw } from "../component/profile/profile-pyw";
import type { EngineeringOutputCell } from "../component/profile/profile-output";

// ProfileEngineeringOutput will be rendered inside ProfilePyw now


// On garde seulement la structure vide, les données viendront du state
const defaultProfileData: ProfileHeroData = {
    fullName: "Chargement...",
    title: "",
    company: "",
    location: "",
    projectCount: 0,
    avatarUrl: "",
};

// Les activités sont vides en attendant d'avoir ces données du backend
const activities: { id: string; title: string; description: string; dateLabel: string; color: "primary" | "tertiary" | "muted" }[] = [];

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<ProfileHeroData>(defaultProfileData);
    const [userProjects, setUserProjects] = useState<{ id: string; name: string; category: string; description: string; status: "completed" | "active"; accentColor: "primary" | "tertiary"; imageUrl: string }[]>([]);
    const [pywWorks, setPywWorks] = useState<Pyw[]>([]);
    const [projectNamesById, setProjectNamesById] = useState<Record<string, string>>({});

    // Etat pour la biographie
    const [bio, setBio] = useState("");
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState("");

    useEffect(() => {
        const loadProfileData = async () => {
            const session = AuthService.getSession();
            if (!session || !session.companyId || !session.user?.id) return;

            // Charger la compagnie pour le nom
            let companyName = "Entreprise non définie";
            try {
                const company = await CompanyService.getById(session.companyId, session.user.id);
                companyName = company.companyName || "Entreprise non définie";
            } catch (err) {
                console.error(err);
            }

            // Charger les projets réels
            let loadedProjects: Project[] = [];
            try {
                loadedProjects = await ProjectService.listByUser(session.user.id, session.companyId);
                const projectNameMap: Record<string, string> = {};
                const mappedProjects = loadedProjects.map(p => {
                    projectNameMap[p.id] = p.projectName;
                    return {
                        id: p.id,
                        name: p.projectName,
                        category: p.status || "Projet",
                        description: p.description || "Aucune description",
                        status: (p.status === "completed" ? "completed" : "active") as "completed" | "active",
                        accentColor: "primary" as const,
                        imageUrl: "",
                    };
                });
                setUserProjects(mappedProjects);
                setProjectNamesById(projectNameMap);

                const pywResults = await Promise.all(
                    loadedProjects.map(async (project) => {
                        try {
                            return await PywService.listByProject(project.id);
                        } catch (error) {
                            console.error(error);
                            return [] as Pyw[];
                        }
                    })
                );

                const allWorks = pywResults.flat().filter((work) => work.userId === session.user.id);
                setPywWorks(allWorks);
            } catch (err) {
                console.error(err);
            }

            setProfile({
                fullName: session.user.name || "Utilisateur",
                title: session.user.role || "Membre",
                company: companyName,
                location: "Non renseigné",
                projectCount: loadedProjects.length,
                avatarUrl: session.user.avatarUrl || "",
            });
        };

        loadProfileData();

        // Charger la biographie depuis le localStorage (Frontend-only)
        const savedBio = localStorage.getItem("user_biography");
        if (savedBio) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setBio(savedBio);
        }
    }, []);

    const handleSaveBio = () => {
        setBio(tempBio);
        localStorage.setItem("user_biography", tempBio);
        setIsEditingBio(false);
    };

    const contributions = useMemo<EngineeringOutputCell[]>(() => {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        start.setDate(start.getDate() - 364);

        const counter = new Map<string, number>();
        pywWorks.forEach((work) => {
            if (!work.createdAt) return;
            const date = new Date(work.createdAt);
            if (Number.isNaN(date.getTime())) return;
            date.setHours(0, 0, 0, 0);
            if (date < start) return;
            const key = date.toISOString().slice(0, 10);
            counter.set(key, (counter.get(key) || 0) + 1);
        });

        return Array.from({ length: 365 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            const key = date.toISOString().slice(0, 10);
            const count = counter.get(key) || 0;
            const level = (count === 0 ? 0 : count === 1 ? 1 : count < 3 ? 2 : 3) as EngineeringOutputCell["level"];
            return {
                date: key,
                count,
                level,
            };
        });
    }, [pywWorks]);

    const totalContributions = pywWorks.length;

    const contributionsMap = useMemo(() => {
        const m: Record<string, number> = {};
        contributions.forEach((c) => {
            m[c.date] = c.level;
        });
        return m;
    }, [contributions]);

    return (
        <AppShell active="profile">
            <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-8">
                <ProfileHero
                    profile={profile}
                    onEditClick={() => {
                        console.log("Edit profile");
                    }}
                    isOwnProfile={true}
                    onViewMessagesClick={() => {
                        router.push("/messages");
                    }}
                    onSendMessageClick={() => {
                        // Action d'envoi de message (ex: aller sur la page de messagerie)
                        console.log("Send Message clicked");
                    }}
                />

                {/* Section Biographie */}
                <section className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-on-surface">À propos (Biographie)</h2>
                        {!isEditingBio && (
                            <button
                                onClick={() => {
                                    setTempBio(bio);
                                    setIsEditingBio(true);
                                }}
                                className="text-sm font-medium text-primary hover:underline"
                            >
                                Modifier
                            </button>
                        )}
                    </div>
                    {isEditingBio ? (
                        <div className="space-y-4">
                            <textarea
                                className="w-full rounded-lg border border-outline-variant bg-surface p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                rows={4}
                                value={tempBio}
                                onChange={(e) => setTempBio(e.target.value)}
                                placeholder="Décrivez votre parcours, vos compétences..."
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditingBio(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveBio}
                                    className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-md transition active:scale-95"
                                >
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap text-sm text-on-surface-variant">
                            {bio || "Aucune biographie renseignée pour le moment. Cliquez sur Modifier pour ajouter quelques informations sur vous."}
                        </p>
                    )}
                </section>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="overflow-auto pr-4">
                        <ProfileProjects projects={userProjects.length > 0 ? userProjects : []} />
                    </div>
                    <div className="overflow-auto pr-4">
                        <ProfilePyw
                            works={pywWorks}
                            projectNames={projectNamesById}
                            contributionsMap={contributionsMap}
                            contributions={contributions}
                            totalContributions={totalContributions}
                        />
                    </div>
                </div>
            </div>
        </AppShell>
    );
}
