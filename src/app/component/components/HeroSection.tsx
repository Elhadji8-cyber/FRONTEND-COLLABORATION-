import Image from "next/image";
import archi from "../image/architector.png"
const heroBackground =
    "linear-gradient(rgba(250, 248, 255, 0.9), rgba(250, 248, 255, 0.8)), url(https://lh3.googleusercontent.com/aida-public/AB6AXuDDdBj4GN_PgOWO8orr9BpuOv3Gvfn5ZafIWoNO3khtgl-d9aW-evi9aPk6YF2Ml06sgk5N4rv3QRGgaN-y1cFSKqZguPh4y83ZWXkbNEuILBAt12Rp6yqN986H-nYE-XsZlrOaN3s7Y905IVXxyc3Iwh8lf85Xq_3GZPYn5ULy6zdMOqtR4n_HtcXd1qZldN-18sWCfncBu1GofVT7fsaR6iY6Q9j41s8EOSikZoLo15MwVb2GeWZTkoBU2Mvt3XDQ0XHvTMzR3Q)";
export const HeroSection = () => {
    return (
        <section
            className="relative flex min-h-[780px] items-center overflow-hidden pt-10"
            style={{
                backgroundImage: heroBackground,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}
        >
            <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div className="z-10 py-12 lg:py-20">
                    <div className="mb-6 inline-flex items-center rounded-full bg-[color:rgba(0,74,198,0.1)] px-3 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary)]">
                        Engineering Intelligence
                    </div>

                    <h1 className="mb-8 max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.07em] text-[var(--on-surface)] sm:text-5xl lg:text-7xl">
                        The Architectural{" "}
                        <span className="text-[var(--primary)]">Monolith</span>
                    </h1>

                    <p className="mb-10 max-w-xl text-lg leading-relaxed text-[var(--on-surface-variant)] sm:text-xl">
                        Precision-driven collaboration for modern engineering. Scale your
                        infrastructure projects with a unified digital job site built for
                        performance.
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                        <button className="rounded-xl bg-[var(--primary)] px-8 py-4 text-lg font-extrabold text-white shadow-xl shadow-[color:rgba(0,74,198,0.2)] transition-all hover:shadow-2xl hover:shadow-[color:rgba(0,74,198,0.3)] active:scale-95">
                            Get Started
                        </button>
                        <button className="rounded-xl bg-[var(--surface-container-highest)] px-8 py-4 text-lg font-extrabold text-[var(--primary)] transition-all hover:bg-[var(--surface-container-high)] active:scale-95">
                            Book a Demo
                        </button>
                    </div>
                </div>

                <div className="relative hidden lg:block">
                    <div className="absolute -inset-4 -rotate-3 rounded-[2rem] bg-[color:rgba(0,74,198,0.05)]" />
                    <Image src={archi} alt="Architecture" loading="eager" className="relative rounded-xl shadow-2xl transition-all duration-700 hover:grayscale-0" />
                </div>
            </div>
        </section>
    );
};
