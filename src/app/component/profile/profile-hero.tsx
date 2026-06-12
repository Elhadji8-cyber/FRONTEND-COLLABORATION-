"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export type ProfileHeroData = {
    fullName: string;
    title: string;
    company: string;
    location: string;
    projectCount: number;
    avatarUrl?: string;
};

type ProfileHeroProps = {
    profile: ProfileHeroData;
    onEditClick?: () => void;
    onSendMessageClick?: () => void;
    isOwnProfile?: boolean;
    onViewMessagesClick?: () => void;
};

export function ProfileHero({
    profile,
    onEditClick,
    onSendMessageClick,
    isOwnProfile,
    onViewMessagesClick,
}: ProfileHeroProps) {
    return (
        <section className="mb-12">
            {/* NOTE: la carte principale reste visuellement identique, mais elle passe par les composants shadcn pour un rendu plus professionnel. */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="relative overflow-hidden rounded-xl bg-surface-container-low p-8">
                <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
                    <div className="relative">
                        <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-surface-container-highest shadow-xl">
                            {profile.avatarUrl ? (
                                <Image
                                    src={profile.avatarUrl}
                                    alt={profile.fullName}
                                    fill
                                    className="object-cover"
                                    sizes="128px"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                                    {profile.fullName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 border-surface-container-low bg-green-500" />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="mb-1 text-4xl font-extrabold tracking-tight text-on-surface">
                            {profile.fullName}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center gap-3 text-on-surface-variant md:justify-start">
                            <Badge variant="primary">{profile.title}</Badge>
                            <span className="text-outline-variant">•</span>
                            <span className="text-sm">{profile.company}</span>
                        </div>

                        <div className="mt-6 flex flex-wrap justify-center gap-4 md:justify-start">
                            <Button onClick={onEditClick} className="rounded-lg px-6 py-2 text-sm font-bold">
                                Edit Profile
                            </Button>

                            {isOwnProfile ? (
                                <Button variant="secondary" onClick={onViewMessagesClick} className="rounded-lg px-6 py-2 text-sm font-bold">
                                    View Messages
                                </Button>
                            ) : (
                                <Button variant="secondary" onClick={onSendMessageClick} className="rounded-lg px-6 py-2 text-sm font-bold">
                                    Send Message
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="rounded-lg border-l-4 border-primary bg-surface-container-lowest p-4 shadow-sm">
                        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                            Projects
                        </p>
                        <p className="text-2xl font-black text-on-surface">
                            {profile.projectCount}
                        </p>
                    </div>

                </div>

                {/*
          TODO: brancher ici ton backend Go
          Backend Go :
          GET /api/v1/users/:id

          Pour la mise à jour :
          PUT /api/v1/users/:id
        */}
            </Card>
            </motion.div>
        </section>
    );
}
