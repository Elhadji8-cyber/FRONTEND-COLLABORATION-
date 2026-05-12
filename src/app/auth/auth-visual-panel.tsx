// src/components/auth/auth-visual-panel.tsx
import Image from "next/image";

type AuthVisualPanelProps = {
  quote?: string;
  footerLabel?: string;
};

export function AuthVisualPanel({
  quote = `"Precision is the foundation of every great structure. Monolith brings your entire engineering lifecycle into focus."`,
  footerLabel = "Project Alpha | Site Operations v4.2",
}: AuthVisualPanelProps) {
  return (
    <section className="relative hidden overflow-hidden md:flex md:w-[55%] lg:w-[60%] blueprint-grid">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4sihA_rBL1FxBx1yQRSa7ttUc1fo3btN9YOgK5SBBku840iOeYXeqYo4FzPITo44whGLLBqKXKjhOMGa8MVAe6P799MJjZkvo1q_L7Pa9I0aGMVmeNZEEuQF1p1ZZAxhwTv2hPkObqtWD1YTn45t6hyMORxxDXyU7du7QZXkjrxEIZblk5crMwHwgsM6sPguDfG6FW4x430rEzAPieo_f0wqeCrQSm46iHVXzB7ueWhCyRoaNKxyK3J8fmPDHmQYVODQRfNQOdA"
          alt="Architectural structure"
          fill
          priority
          className="object-cover grayscale brightness-75 contrast-125"
          sizes="60vw"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex h-full w-full flex-col justify-end p-20">
        <div className="grid max-w-2xl grid-cols-2 gap-8">
          <div className="border-l-4 border-primary bg-surface-container-low/40 p-8 backdrop-blur-xl">
            <div className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-primary">
              Active Projects
            </div>
            <div className="text-4xl font-black text-on-surface">442</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[1px] w-12 bg-outline-variant" />
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Site ID: 4492-B
              </span>
            </div>
          </div>

          <div className="border-l-4 border-tertiary bg-surface-container-low/40 p-8 backdrop-blur-xl">
            <div className="mb-1 text-[0.65rem] font-black uppercase tracking-[0.2em] text-tertiary">
              Collaborators
            </div>
            <div className="text-4xl font-black text-on-surface">1.2k</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-[1px] w-12 bg-outline-variant" />
              <span className="text-[0.6rem] font-bold uppercase tracking-widest text-on-surface-variant">
                Global Access
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-lg">
          <p className="text-lg font-bold leading-tight text-on-surface">
            {quote}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            {footerLabel}
          </p>
        </div>
      </div>

      <div className="absolute right-10 top-10 flex flex-col items-end gap-1 opacity-40">
        <div className="text-[0.5rem] font-mono text-on-surface-variant">
          LAT: 40.7128° N
        </div>
        <div className="text-[0.5rem] font-mono text-on-surface-variant">
          LONG: 74.0060° W
        </div>
        <div className="text-[0.5rem] font-mono text-on-surface-variant">
          ELEV: 245.00 M
        </div>
      </div>

      <div className="absolute right-0 top-0 m-8 h-32 w-32 border-r-2 border-t-2 border-primary opacity-20" />
      <div className="absolute bottom-0 left-0 m-8 h-32 w-32 border-b-2 border-l-2 border-primary opacity-20" />
    </section>
  );
}
