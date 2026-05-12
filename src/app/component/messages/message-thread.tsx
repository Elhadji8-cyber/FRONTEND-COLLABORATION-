type ChatHeaderProps = {
    title: string;
    subtitle: string;
    memberCountLabel?: string;
};

export function MessageHeader({
    title,
    subtitle,
    memberCountLabel = "+12",
}: ChatHeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-outline-variant/10 bg-surface px-4 sm:px-6 lg:px-8">
            <div>
                <h1 className="flex items-center gap-2 text-lg font-bold text-on-surface">
                    {title}
                    <span className="material-symbols-outlined text-sm opacity-40">star</span>
                </h1>
                <p className="text-[11px] font-medium tracking-wide text-on-surface-variant">
                    {subtitle}
                </p>
            </div>

            <div className="hidden items-center gap-6 lg:flex">
                <div className="flex -space-x-2">
                    <div className="h-7 w-7 rounded-full border-2 border-surface bg-surface-container-highest" />
                    <div className="h-7 w-7 rounded-full border-2 border-surface bg-surface-container-highest" />
                    <div className="h-7 w-7 rounded-full border-2 border-surface bg-surface-container-highest" />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-surface-container-highest text-[10px] font-bold text-primary">
                        {memberCountLabel}
                    </div>
                </div>

                <div className="h-8 w-px bg-outline-variant/20" />

                <button className="cursor-pointer text-on-surface-variant transition hover:text-primary">
                    <span className="material-symbols-outlined">info</span>
                </button>
            </div>

            {/*
        TODO: brancher ici les vraies données conversation depuis ton backend Go.

        Backend Go :
        GET /api/v1/conversations/:id

        Tu pourras récupérer :
        - name / title
        - description / topic
        - members
        - type de conversation

        Puis mapper :
        title -> nom conversation
        subtitle -> description
        memberCountLabel -> nombre de participants
      */}
        </header>
    );
}
