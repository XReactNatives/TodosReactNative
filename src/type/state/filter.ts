export const FilterTypes = ["All", "Done", "UnDone"] as const;
export type FilterType = typeof FilterTypes[number];

export const filterPredicate: Record<FilterType, (completed: boolean) => boolean> = {
  All: () => true,
  Done: (c) => c,
  UnDone: (c) => !c,
}; 