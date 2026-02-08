import type { Zip } from './types.js';

export const zip: Zip = (f) => (a, m) => Array.from(
    { length: Math.min(a.length, m.length) },
    (_, i) => f(a[i], m[i]),
);
