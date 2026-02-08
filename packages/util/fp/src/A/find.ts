import type { Find } from './types.js';

export const find: Find = <A, M>(f: (a: A, i: number, m: M) => boolean) => (a: A[], m: M) => a.find((e, i) => f(e, i, m));
