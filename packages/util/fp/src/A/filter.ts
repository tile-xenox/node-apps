import type { Filter } from './types.js';

export const filter: Filter = <A, M>(f: (a: A, i: number, m: M) => boolean) => (a: A[], m: M) => a.filter((e, i) => f(e, i, m));
