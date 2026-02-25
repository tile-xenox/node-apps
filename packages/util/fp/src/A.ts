import type {
    SemiGroup,
    HKT,
    Applicative,
    Applicative1,
    Sequence1,
} from './HKT.js';

type Map = <A, M, B>(f: (a: A, m: M, i: number) => B) => (a: A[], m: M) => B[];
const map: Map = (f) => (a, m) => a.map((e, i) => f(e, m, i));


type Filter = {
    <A, M, B extends A>(f: (a: A, m: M, i: number) => a is B): (a: A[], m: M) => B[];
    <A, M>(f: (a: A, m: M, i: number) => boolean): (a: A[], m: M) => A[];
};
const filter: Filter = <A, M>(f: (a: A, m: M, i: number) => boolean) => (a: A[], m: M) => a.filter((e, i) => f(e, m, i));


type Reduce = <A, M, B>(b: (m: M) => B, f: (c: A, m: M, p: B, i: number) => B) => (a: A[], m: M) => B;
const reduce: Reduce = (b, f) => (a, m) => a.reduce((p, c, i) => f(c, m, p, i), b(m));


type Find = {
    <A, M, B extends A>(f: (a: A, m: M, i: number) => a is B): (a: A[], m: M) => B | undefined;
    <A, M>(f: (a: A, m: M, i: number) => boolean): (a: A[], m: M) => A | undefined;
};
const find: Find = <A, M>(f: (a: A, m: M, i: number) => boolean) => (a: A[], m: M) => a.find((e, i) => f(e, m, i));


type FlatMap = <A, M, B>(f: (a: A, m: M, i: number) => B[]) => (a: A[], m: M) => B[];
const flatMap: FlatMap = (f) => (a, m) => a.flatMap((e, i) => f(e, m, i));


type Every = {
    <A, M, B extends A>(f: (a: A, m: M, i: number) => a is B): (a: A[], m: M) => a is B[];
    <A, M>(f: (a: A, m: M, i: number) => boolean): (a: A[], m: M) => boolean;
};
const every: Every = <A, M>(f: (a: A, m: M, i: number) => boolean) => ((a: A[], m: M) => a.every((e, i) => f(e, m, i))) as never;


type Some = <A, M>(f: (a: A, m: M, i: number) => boolean) => (a: A[], m: M) => boolean;
const some: Some = (f) => (a, m) => a.some((e, i) => f(e, m, i));


type Sort = <A, M>(...ords: ((a: A, b: A, m: M) => number)[]) => (a: A[], m: M) => A[];
const sort: Sort = (...ords) => (a, m) => a.sort((a, b) => ords.reduce((p, c) => p || c(a, b, m), 0));


type GroupBy = <A, M, B>(f: (a: A, m: M, i: number) => B) => (a: A[], m: M) => [B, A[]][];
const groupBy: GroupBy = (f) => (a, m) => [...Map.groupBy(a, (e, i) => f(e, m, i))];


type Tuple = <A, M, B extends [unknown, ...unknown[]]>(f: (a: A, m: M) => B) => (a: A, m: M) => B;
const tuple: Tuple = (f) => f;


type From = <A, M, B>(l: (a: A, m: M) => number, f: (a: A, m: M, i: number) => B) => (a: A, m: M) => B[];
const from: From = (l, f) => (a, m) => Array.from({ length: l(a, m) }, (_, i) => f(a, m, i));


type Zip = <A, M, B>(f: (a: A, m: M) => B) => (a: A[], m: M[]) => B[];
const zip: Zip = (f) => from((a, m) => Math.min(a.length, m.length), (a, m, i) => f(a[i], m[i]));


type SemiG = <A = never>() => SemiGroup<A[]>;
const semiG: SemiG = () => ({ concat: (a, b) => [...a, ...b] });


type App = () => Applicative1<'Array'>;
const app: App = () => ({
    URI: 'Array',
    map: (fa, f) => fa.map(f),
    ap: (fab, fa) => fab.flatMap((f) => fa.map(f)),
    of: (a) => [a],
});


type Seq = Sequence1<'Array'>;
const seq: Seq = <U>(app: Applicative<U>) => <A>(a: HKT<U, A>[]): HKT<U, A[]> => a.reduce(
    (fas, fa) => app.ap(
        app.map(fas, (as) => (a: A) => [...as, a]),
        fa,
    ),
    app.of<A[]>([]),
);


export type A = {
    from: From,
    map: Map,
    filter: Filter,
    reduce: Reduce,
    find: Find,
    flatMap: FlatMap,
    every: Every,
    some: Some,
    sort: Sort,
    groupBy: GroupBy,
    tuple: Tuple,
    zip: Zip,
    semiG: SemiG,
    app: App,
    seq: Seq,
};

export const A: A = {
    from,
    map,
    filter,
    reduce,
    find,
    flatMap,
    every,
    some,
    sort,
    groupBy,
    tuple,
    zip,
    semiG,
    app,
    seq,
};
