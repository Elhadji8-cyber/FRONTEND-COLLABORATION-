"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { AppShell } from "../component/layout/app-shell";
import { Card } from "../component/ui/card";
import { Button } from "../component/ui/button";
import { AuthService } from "@/services/auth.service";
import { ProjectService } from "@/services/project.service";

export default function MessagesRedirectPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Ouverture de la messagerie...");
    const [error, setError] = useState("");

    useEffect(() => {
        async function openMessages() {
            const session = AuthService.getSession();
            const urlParams = new URLSearchParams(window.location.search);
            const conversationId = urlParams.get("conversation_id");

            if (!session?.user.id || !session.companyId) {
                router.replace("/auth/login");
                return;
            }

            try {
const projects = await ProjectService.listByUser(session.user.id, session.user.id, session.companyId);

                if (projects.length === 0) {
                    setMessage("");
                    setError("Créez d'abord un projet pour ouvrir la messagerie.");
                    return;
                }

                const target = `/projects/${projects[0].id}/messages${conversationId ? `?conversation_id=${conversationId}` : ""}`;
                router.replace(target);
            } catch (err) {
                setMessage("");
                setError(err instanceof Error ? err.message : "Impossible d'ouvrir la messagerie.");
            }
        }

        openMessages();
    }, [router]);

    return (
        <AppShell active="messages" >
            <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8 ">
                {/* NOTE: on garde l’état actuel, mais la zone de messagerie devient plus propre avec une carte shadcn et une micro-animation. */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 shadow-sm">
                        {message ? (
                            <div className="rounded-2xl bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
                                {message}
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-4 rounded-2xl border border-error/20 bg-error-container px-4 py-3 text-sm text-error">
                                {error}
                            </div>
                        ) : null}

                        <div className="mt-6 flex justify-end">
                            <Button variant="secondary" onClick={() => router.push("/projects")}>
                                Retour aux projets
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </AppShell>
    );
}
