import type { Result } from './R.js';

export type SemiGroup<A> = {
    concat: (x: A, y: A) => A;
};

export type HKT<U, A> = {
    _URI: U;
    _A: A;
};

type URI2Kind1<A> = {
    Array: Array<A>,
    Promise: Promise<A>,
};

type URI2Kind2<A, E> = {
    Result: Result<A, E>,
};

type URIS1 = keyof URI2Kind1<unknown>;
type URIS2 = keyof URI2Kind2<unknown, unknown>;

type Kind1<URI extends URIS1, A> = URI2Kind1<A>[URI];
type Kind2<URI extends URIS2, A, E> = URI2Kind2<A, E>[URI];

export type Applicative<U> = {
    URI: U;
    of: <A>(a: A) => HKT<U, A>;
    map: <A, B>(fa: HKT<U, A>, f: (a: A) => B) => HKT<U, B>;
    ap: <A, B>(fab: HKT<U, (a: A) => B>, fa: HKT<U, A>) => HKT<U, B>;
};

export type Applicative1<U extends URIS1> = {
    URI: U;
    of: <A>(a: A) => Kind1<U, A>;
    map: <A, B>(fa: Kind1<U, A>, f: (a: A) => B) => Kind1<U, B>;
    ap: <A, B>(fab: Kind1<U, (a: A) => B>, fa: Kind1<U, A>) => Kind1<U, B>;
};

export type Applicative2<U extends URIS2> = {
    URI: U;
    of: <A, E>(a: A) => Kind2<U, A, E>;
    map: <A, B, E>(fa: Kind2<U, A, E>, f: (a: A) => B) => Kind2<U, B, E>;
    ap: <A, B, E>(fab: Kind2<U, (a: A) => B, E>, fa: Kind2<U, A, E>) => Kind2<U, B, E>;
};

export type Applicative2C<U extends URIS2, E> = {
    URI: U;
    of: <A>(a: A) => Kind2<U, A, E>;
    map: <A, B>(fa: Kind2<U, A, E>, f: (a: A) => B) => Kind2<U, B, E>;
    ap: <A, B>(fab: Kind2<U, (a: A) => B, E>, fa: Kind2<U, A, E>) => Kind2<U, B, E>;
};

export type Sequence1<U extends URIS1> = {
    <V extends URIS2>(app: Applicative2<V>): <A, E>(a: Kind1<U, Kind2<V, A, E>>) => Kind2<V, Kind1<U, A>, E>;
    <V extends URIS2, E>(app: Applicative2C<V, E>): <A>(a: Kind1<U, Kind2<V, A, E>>) => Kind2<V, Kind1<U, A>, E>;
    <V extends URIS1>(app: Applicative1<V>): <A>(a: Kind1<U, Kind1<V, A>>) => Kind1<V, Kind1<U, A>>;
    <V>(app: Applicative<V>): <A>(a: Kind1<U, HKT<V, A>>) => HKT<V, Kind1<U, A>>;
};

export type Sequence2<U extends URIS2> = {
    <V extends URIS2>(app: Applicative2<V>): <A, E, F>(a: Kind2<U, Kind2<V, A, F>, E>) => Kind2<V, Kind2<U, A, E>, F>;
    <V extends URIS2, F>(app: Applicative2C<V, F>): <A, E>(a: Kind2<U, Kind2<V, A, F>, E>) => Kind2<V, Kind2<U, A, E>, F>;
    <V extends URIS1>(app: Applicative1<V>): <A, E>(a: Kind2<U, Kind1<V, A>, E>) => Kind1<V, Kind2<U, A, E>>;
    <V>(app: Applicative<V>): <A, E>(a: Kind2<U, HKT<V, A>, E>) => HKT<V, Kind2<U, A, E>>;
};

export type Sequence2E<U extends URIS2> = {
    <V extends URIS2>(app: Applicative2<V>): <A, B, E>(a: Kind2<U, A, Kind2<V, B, E>>) => Kind2<V, B, Kind2<U, A, E>>;
    <V extends URIS2, B>(app: Applicative2C<V, B>): <A, E>(a: Kind2<U, A, Kind2<V, B, E>>) => Kind2<V, B, Kind2<U, A, E>>;
    <V extends URIS1>(app: Applicative1<V>): <A, E>(a: Kind2<U, A, Kind1<V, E>>) => Kind1<V, Kind2<U, A, E>>;
    <V>(app: Applicative<V>): <A, E>(a: Kind2<U, A, HKT<V, E>>) => HKT<V, Kind2<U, A, E>>;
};

export type SequenceS = {
    <U extends URIS2>(app: Applicative2<U>): <R extends Record<string, Kind2<U, any, E>>, E>(r: R) => Kind2<U, {
        [K in keyof R]: [R[K]] extends [Kind2<U, infer A, any>] ? A : never;
    }, E>;
    <U extends URIS2, E>(app: Applicative2C<U, E>): <R extends Record<string, Kind2<U, any, E>>>(r: R) => Kind2<U, {
        [K in keyof R]: [R[K]] extends [Kind2<U, infer A, any>] ? A : never;
    }, E>;
    <U extends URIS1>(app: Applicative1<U>): <R extends Record<string, Kind1<U, any>>>(r: R) => Kind1<U, {
        [K in keyof R]: [R[K]] extends [Kind1<U, infer A>] ? A : never;
    }>;
    <U>(app: Applicative<U>): <R extends Record<string, HKT<U, any>>>(r: R) => HKT<U, {
        [K in keyof R]: [R[K]] extends [HKT<U, infer A>] ? A : never;
    }>;
};
