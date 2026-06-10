import Image from "next/image";
import { motion } from "framer-motion";


const heroBackground =
    "linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(30, 41, 59, 0.92), rgba(37, 99, 235, 0.95))";

export const HeroSection = () => {
    return (
        <section
            className="relative flex min-h-[720px] items-center overflow-hidden pt-10"
            style={{
                backgroundImage: heroBackground,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="z-10 flex flex-col justify-center py-12 lg:py-20"
                >
                    <div className="mb-6 size-fit inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-blue-100 backdrop-blur-md">
                        Monoolith system
                    </div>

                    <h1 className="mb-8 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-5xl lg:text-7xl">
                        La plateforme moderne pour
                        <span className="text-blue-100"> gérer vos projets, fichiers et équipes</span>
                    </h1>

                    <p className="mb-10 max-w-xl text-lg leading-relaxed text-blue-100/95 sm:text-xl">
                        Centralisez la gestion des tâches, le chat, la collaboration, le versioning et le suivi des fichiers dans un environnement clair et rapide.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <button className="rounded-xl bg-white px-8 py-4 text-lg font-extrabold text-blue-700 shadow-xl shadow-blue-950/20 transition-all hover:-translate-y-0.5 hover:bg-blue-50 active:scale-95">
                            Commencer
                        </button>
                        <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-lg font-extrabold text-white backdrop-blur-md transition-all hover:bg-white/15 active:scale-95">
                            Voir les modules
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                    className="relative hidden lg:flex lg:items-center lg:justify-center"
                >
                    <div className="relative w-full max-w-[700px] rounded-[28px] bg-white/10 p-3 shadow-2xl shadow-blue-950/30 ring-1 ring-white/10 backdrop-blur-md">
                        <div className="absolute inset-x-3 top-3 bottom-3 rounded-[24px] bg-white/95 shadow-inner" />
                        <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="relative z-10 h-[430px] w-full rounded-[22px] border border-white/10 object-cover shadow-xl shadow-blue-950/20"
                        >
                            <source src="/video/monoolith.mp4" type="video/mp4" />
                        </video>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
