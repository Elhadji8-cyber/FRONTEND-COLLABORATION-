export function Topbar() {
    return (
        <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-outline-variant/10 bg-background/90 backdrop-blur lg:left-64">
            <div className="flex h-full items-center justify-between px-4 lg:px-12">
                <div className="hidden max-w-xl flex-1 lg:block">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Search blueprints, assets, or teams..."
                            className="w-full rounded-full border-none bg-surface-container-low py-2.5 pl-12 pr-4 text-sm outline-none ring-0"
                        />
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-4 lg:gap-6">
                    <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="rounded-full p-2 text-on-surface-variant transition hover:bg-surface-container">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest" />
                </div>
            </div>
        </header>
    );
}
