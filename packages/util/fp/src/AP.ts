import { tp, type MaybePromise } from './__inner__.js';
import { A } from './A.js';

type Map = <A, M, B>(f: (a: A, b: { i: number, m: M }) => MaybePromise<B>) => (a: A[], m: M) => Promise<B[]>;
const map: Map = (f) => (a, m) => Promise.all(A.map(f)(a, m));


type FlatMap = <A, M, B>(f: (a: A, b: { i: number, m: M }) => MaybePromise<B[]>) => (a: A[], m: M) => Promise<B[]>;
const flatMap: FlatMap = (f) => (a, m) => map(f)(a, m).then((b) => b.flat());


type Reduce = <A, M, B>(b: (m: M) => MaybePromise<B>, f: (c: A, b: { p: B, i: number, m: M }) => MaybePromise<B>) => (a: A[], m: M) => Promise<B>;
const reduce: Reduce = (b, f) => A.reduce(tp(b), (c, { p, i, m }) => p.then((p) => tp(f)(c, { p, i, m })));


export type AP = {
    map: Map,
    flatMap: FlatMap,
    reduce: Reduce,
};

export const AP: AP = {
    map,
    flatMap,
    reduce,
};
