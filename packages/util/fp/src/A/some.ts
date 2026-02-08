import type { Some } from './types.js';

export const some: Some = (f) => (a, m) => a.some((e, i) => f(e, i, m));
