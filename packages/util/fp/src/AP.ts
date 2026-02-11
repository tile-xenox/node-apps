import type { MaybePromise } from './__inner__.js';

type Map = <A, M, B>(f: (a: A, i: number, m: M) => MaybePromise<B>) => (a: A[], m: M) => Promise<B[]>;
const map: Map = (f) => (a, m) => Promise.all(a.map((e, i) => f(e, i, m)));


export type AP = { map: Map };

export const AP: AP = { map };
