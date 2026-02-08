import type { Reduce } from './types.js';

export const reduce: Reduce = (b, f) => (a, m) => a.reduce((b, a, i) => f(b, a, i, m), b);
