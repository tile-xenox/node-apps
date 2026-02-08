import type { FlatMap } from './types.js';

export const flatMap: FlatMap = (f) => (a, m) => a.flatMap((e, i) => f(e, i, m));
