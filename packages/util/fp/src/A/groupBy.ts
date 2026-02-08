import type { GroupBy } from './types.js';

export const groupBy: GroupBy = (f) => (a, m) => [...Map.groupBy(a, (e, i) => f(e, i, m))];
