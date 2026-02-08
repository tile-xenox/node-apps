import type { SemiGroup, Applicative1, Sequence1 } from '../HKT/types.js';

export type Map = <A, M, B>(f: (a: A, i: number, m: M) => B) => (a: A[], m: M) => B[];

export type Filter = {
    <A, M, B extends A>(f: (a: A, i: number, m: M) => a is B): (a: A[], m: M) => B[];
    <A, M>(f: (a: A, i: number, m: M) => boolean): (a: A[], m: M) => A[];
};

export type Reduce = <A, M, B>(b: B, f: (b: B, a: A, i: number, m: M) => B) => (a: A[], m: M) => B;

export type Find = {
    <A, M, B extends A>(f: (a: A, i: number, m: M) => a is B): (a: A[], m: M) => B | undefined;
    <A, M>(f: (a: A, i: number, m: M) => boolean): (a: A[], m: M) => A | undefined;
};

export type FlatMap = <A, M, B>(f: (a: A, i: number, m: M) => B[]) => (a: A[], m: M) => B[];

export type Every = {
    <A, M, B extends A>(f: (a: A, i: number, m: M) => a is B): (a: A[], m: M) => a is B[];
    <A, M>(f: (a: A, i: number, m: M) => boolean): (a: A[], m: M) => boolean;
};

export type Some = <A, M>(f: (a: A, i: number, m: M) => boolean) => (a: A[], m: M) => boolean;

export type Sort = <A, M>(...ords: ((a: A, b: A, m: M) => number)[]) => (a: A[], m: M) => A[];

export type GroupBy = <A, M, B>(f: (a: A, i: number, m: M) => B) => (a: A[], m: M) => [B, A[]][];

export type Tuple = <A, M, B extends [unknown, ...unknown[]]>(f: (a: A, m: M) => B) => (a: A, m: M) => B;

export type Zip = <A, M, B>(f: (a: A, m: M) => B) => (a: A[], m: M[]) => B[];

export type SemiG = <A = never>() => SemiGroup<A[]>;

export type App = () => Applicative1<'Array'>;

export type Seq = Sequence1<'Array'>;
