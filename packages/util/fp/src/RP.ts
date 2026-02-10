import type { MaybePromise } from './__inner__.js';
import { R, type Result } from './R.js'
import { P } from './P.js';

type Try = <A, M, B>(f: (a: A, m: M) => MaybePromise<B>) => (a: A, m: M) => Promise<Result<B, unknown>>;
const try_: Try = (f) => (a, m) => Promise.resolve().then(() => f(a, m)).then(R.ok, R.err);


type Filter = <A, M>(f: (a: A, m: M) => Promise<boolean>) => (a: A, m: M) => Promise<Result<A, A>>;
const filter: Filter = (f) => (a, m) => f(a, m).then((c) => c ? R.ok(a) : R.err(a));


type Map = <A, M, B>(f: (a: A, m: M) => Promise<B>) => <E>(a: Result<A, E>, m: M) => Promise<Result<B, E>>;
const map: Map = (f) => (a, m) => R.seq(P.app())(R.map(f)(a, m));


type MapE = <E, M, F>(f: (e: E, m: M) => Promise<F>) => <A>(a: Result<A, E>, m: M) => Promise<Result<A, F>>;
const mapE: MapE = (f) => (a, m) => R.seqE(P.app())(R.mapE(f)(a, m));


type FlatMap = <A, B, E, F, M>(f: (a: A, m: M) => Promise<Result<B, F>>) => (a: Result<A, E>, m: M) => Promise<Result<B, E | F>>;
const flat = <A, E, F>(a: Result<Result<A, E>, F>): Result<A, E | F> => R.isOk(a) ? a.ok : a;
const flatMap: FlatMap = (f) => (a, m) => R.seq(P.app())(R.map(f)(a, m)).then(flat);


type FlatMapE = <A, B, E, F, M>(f: (a: E, m: M) => Promise<Result<B, F>>) => (a: Result<A, E>, m: M) => Promise<Result<A | B, F>>;
const flatE = <A, B, E>(a: Result<A, Result<B, E>>): Result<A | B, E> => R.isErr(a) ? a.err : a;
const flatMapE: FlatMapE = (f) => (a, m) => R.seqE(P.app())(R.mapE(f)(a, m)).then(flatE);


export type RP = {
    try: Try,
    filter: Filter,
    map: Map,
    mapE: MapE,
    flatMap: FlatMap,
    flatMapE: FlatMapE,
};

export const RP: RP = {
    try: try_,
    filter,
    map,
    mapE,
    flatMap,
    flatMapE,
};
