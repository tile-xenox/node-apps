import type { Recursive } from './types.js';

export const recursive: Recursive = <A, M, B>(f: (a: A, m: M, r: (a: A, m: M) => B) => B) => {
    type X = (x: X) => (a: A, m: M) => B;
    const x: X = (x) => (a, m) => f(a, m, x(x));
    return x(x);
};
