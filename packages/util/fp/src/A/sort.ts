import type { Sort } from './types.js';

export const sort: Sort = (...ords) => (a, m) => a.sort((a, b) => ords.reduce((p, c) => p || c(a, b, m), 0));
