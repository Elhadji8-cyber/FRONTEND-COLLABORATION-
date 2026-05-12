// exemple local dans profile/page.tsx ou dans src/lib/profile-mocks.ts
import type { EngineeringOutputCell } from "../app/component/profile/profile-output";

export function generateMockEngineeringOutput(): EngineeringOutputCell[] {
  const cells: EngineeringOutputCell[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const current = new Date(today);
    current.setDate(today.getDate() - i);

    const random = Math.random();
    let count = 0;
    let level: 0 | 1 | 2 | 3 = 0;

    if (random > 0.78) {
      count = Math.floor(Math.random() * 2) + 1;
      level = 1;
    }

    if (random > 0.9) {
      count = Math.floor(Math.random() * 3) + 3;
      level = 2;
    }

    if (random > 0.97) {
      count = Math.floor(Math.random() * 4) + 6;
      level = 3;
    }

    cells.push({
      date: current.toISOString().slice(0, 10),
      count,
      level,
    });
  }

  return cells;
}
