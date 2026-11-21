// Plain helpers with no database access, so they can also be used in browser components.
export const MOODS = ["Wedding", "Office", "Evening", "Daily", "Gift"] as const;
export const splitMoods = (v: string) => v.split(",").map((x) => x.trim()).filter((x) => (MOODS as readonly string[]).includes(x));
export const splitAngles = (v: string) => v.split("\n").map((x) => x.trim()).filter(Boolean);
