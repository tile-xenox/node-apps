import type { Right, Left } from './__inner__.js';
import type { MaybePromise } from '../types.js';
import type { SemiGroup, Applicative2, Applicative2C, Sequence2 } from '../HKT/types.js';

export type Result<A, E> = Right<A> | Left<E>

export type Ok = <A = never, E = never>(a: A) => Result<A, E>;

export type Err = <A = never, E = never>(e: E) => Result<A, E>;

export type IsOk = <A, E>(r: Result<A, E>) => r is Right<A>;

export type IsErr = <A, E>(r: Result<A, E>) => r is Left<E>;

export type Map = <A, M, B>(f: (a: A, m: M) => B) => <E>(a: Result<A, E>, m: M) => Result<B, E>;

export type MapE = <E, M, F>(f: (e: E, m: M) => F) => <A>(a: Result<A, E>, m: M) => Result<A, F>;

export type Get = <B, E, M>(f: (e: E, m: M) => B) => <A>(a: Result<A, E>, m: M) => A | B;

export type Flat = <A, E, F>() => (a: Result<Result<A, E>, F>) => Result<A, E | F>;

export type FlatE = <A, B, E>() => (a: Result<A, Result<B, E>>) => Result<A | B, E>;

export type Filter = {
    <A, M, B extends A>(f: (a: A, m: M) => a is B): (a: A, m: M) => Result<B, Exclude<A, B>>;
    <A, M>(f: (a: A, m: M) => boolean): (a: A, m: M) => Result<A, A>;
    <A, M>(f: (a: A, m: M) => Promise<boolean>): (a: A, m: M) => Promise<Result<A, A>>;
}

export type Try = <A, M, B>(f: (a: A, m: M) => MaybePromise<B>) => (a: A, m: M) => Promise<Result<B, unknown>>;

export type TryS = <A, M, B>(f: (a: A, m: M) => B) => (a: A, m: M) => Result<B, unknown>;

export type Zip = <A, B, C, E, F>(f: (a: A, b: B) => C) => (a: Result<A, E>, m: Result<B, F>) => Result<C, E | F>;

export type ZipE = <A, B, E, F, G>(f: (a: E, b: F) => G) => (a: Result<A, E>, m: Result<B, F>) => Result<A | B, G>;

export type Flip = <A, E>() => (a: Result<A, E>) => Result<E, A>;

export type App = {
    (): Applicative2<'Result'>;
    <E>(se: SemiGroup<E>): Applicative2C<'Result', E>;
};

export type Seq = Sequence2<'Result'>;
