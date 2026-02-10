import { fp, type MaybePromise } from "./__inner__";

type State = { a: unknown, m: unknown, p: boolean };
type Init = { a: undefined, m: undefined, p: false };

type Or<A, B, C> = [A, B, C] extends [false, false, false] ? false : true;
type IsP<A> = A extends Promise<any> ? true : false;

type Compute<T> = { [K in keyof T]: T[K] } | never;

type Next<S extends State, A, M> = {
    a: Awaited<A>,
    m: Awaited<M>,
    p: Or<S['p'], IsP<A>, IsP<M>>,
};

type Pipeline<S extends State> = {
    next: <A, M = S['m']>(f:
        | ((a: S['a'], m: S['m']) => A)
        | [(a: S['a'], m: S['m']) => A, (a: S['a'], m: S['m']) => M]
    ) => Pipeline<Compute<Next<S, A, M>>>,
};

type Return<S extends State> = S['p'] extends true ? Promise<S['a']> : S['a'];


type C = (a: unknown, m: unknown) => unknown;
type D = C | [C, C];
type P = { fa: D[], next: (f: D) => P };
type S = MaybePromise<{ a: unknown, m: unknown }>;

const p = (fa: D[] = []): P => ({ fa, next: (f) => p([...fa, f]) });

type Pipe = <S extends State>(line: (p: Pipeline<Init>) => Pipeline<S>) => Return<S>;
const pipe: Pipe = (line) => {
    const { fa } = line(p() as never) as unknown as P;
    return fp(
        fa.reduce<S>(
            (p, c) => fp(
                p,
                (p) => Array.isArray(c)
                    ? fp(
                        c[0](p.a, p.m),
                        (a) => fp(
                            c[1](p.a, p.m),
                            (m) => ({ a, m }),
                        ),
                    )
                    : fp(
                        c(p.a, p.m),
                        (a) => ({ a, m: p.m }),
                    ),
            ),
            { a: undefined, m: undefined },
        ),
        (r) => r.a,
    ) as never;
};


type Flow = <A, M, S extends State>(line: (p: Pipeline<Compute<Next<Init, A, M>>>) => Pipeline<S>) => (a: A, m: M) => Return<S>;
const flow: Flow = (line) => (a, m) => pipe((p) => line(p.next([() => a, () => m])));


type Tap = <A, M>(f: (a: A, m: M) => unknown) => (a: A, m: M) => A;
const tap: Tap = (f) => (a, m) => (f(a, m), a);


type Memo = <A, M, B>(f: (a: A, m: M) => B) => [(a: A, m: M) => A, (a: A, m: M) => B];
const memo: Memo = (f) => [(a) => a, (a, m) => f(a, m)];


type Exchange = <A, M>() => [(a: A, m: M) => M, (a: A, m: M) => A];
const exchange: Exchange = () => [(_, m) => m, (a) => a];


type Recursive = <A, M, B>(f: (a: A, m: M, r: (a: A, m: M) => B) => B) => (a: A, m: M) => B;
const recursive: Recursive = <A, M, B>(f: (a: A, m: M, r: (a: A, m: M) => B) => B) => {
    type X = (x: X) => (a: A, m: M) => B;
    const x: X = (x) => (a, m) => f(a, m, x(x));
    return x(x);
};


export type F = {
    pipe: Pipe,
    flow: Flow,
    tap: Tap,
    memo: Memo,
    exchange: Exchange,
    recursive: Recursive,
};

export const F: F = {
    pipe,
    flow,
    tap,
    memo,
    exchange,
    recursive,
};
