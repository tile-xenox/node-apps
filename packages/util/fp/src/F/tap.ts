import type { Tap } from './types.js';

export const tap: Tap = (f) => (a, m) => (f(a, m), a);
