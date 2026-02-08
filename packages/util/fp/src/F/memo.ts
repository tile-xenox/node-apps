import type { Memo } from './types.js';

export const memo: Memo = (f) => [
    (a) => a,
    (a, m) => f(a, m)
];
