// src/components/profile/profile-engineering-output.tsx
type ContributionLevel = 0 | 1 | 2 | 3;

export type EngineeringOutputCell = {
  date: string;
  count: number;
  level: ContributionLevel;
};

type EngineeringOutputProps = {
  totalContributions: number;
  cells: EngineeringOutputCell[];
  title?: string;
};

function cellColor(level: ContributionLevel) {
  // GitHub-like contribution palette (hex)
  switch (level) {
    case 0:
      return "#ebedf0"; // empty
    case 1:
      return "#9be9a8"; // light
    case 2:
      return "#40c463"; // medium
    case 3:
      return "#30a14e"; // dark
    default:
      return "#ebedf0";
  }
}

export function ProfileEngineeringOutput({
  totalContributions,
  cells,
  title = "Engineering Output",
}: EngineeringOutputProps) {
  return (
    <section className="rounded-2xl border-l-4 border-primary/20 bg-surface-container-lowest p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-bold uppercase tracking-widest text-on-surface">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-[10px] text-on-surface-variant">
          <span>Less</span>
          <div className="h-3 w-3 rounded-sm bg-surface-container" />
          <div className="h-3 w-3 rounded-sm bg-primary/20" />
          <div className="h-3 w-3 rounded-sm bg-primary/45" />
          <div className="h-3 w-3 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid h-32 min-w-[720px] grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date} - ${cell.count} contribution${cell.count > 1 ? "s" : ""}`}
              className={`h-3 w-3 rounded-sm`}
              style={{ backgroundColor: cellColor(cell.level) }}
            />
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-on-surface-variant">
        <span className="font-bold text-on-surface">{totalContributions}</span>{" "}
        technical contributions in the last year.
      </p>
    </section>
  );
}
