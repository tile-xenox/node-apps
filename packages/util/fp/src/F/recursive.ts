import type { Recursive } from './types.js';

export const recursive: Recursive = <B>() => <A, M>(f: (r: (a: A, m: M) => B) => (a: A, m: M) => B) => {
    type X = (x: X) => (a: A, m: M) => B;
    const x: X = (x) => f((a, m) => x(x)(a, m));
    return x(x);
};
