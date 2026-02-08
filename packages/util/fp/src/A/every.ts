import type { Every } from './types.js';

export const every: Every = <A, M>(f: (a: A, i: number, m: M) => boolean) => ((a: A[], m: M) => a.every((e, i) => f(e, i, m))) as never;
