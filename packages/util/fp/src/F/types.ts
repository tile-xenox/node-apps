type State = { a: unknown, m: unknown, p: boolean };
type Init = { a: undefined, m: undefined, p: false };

type Or<A, B, C> = [A, B, C] extends [false, false, false] ? false : true;
type IsP<A> = A extends Promise<any> ? true : false;

type Compute<T> = { [K in keyof T]: T[K] } | never;

type Next<S extends State, A, M> = {
    a: Awaited<A>,
    m: Awaited<M>,
    p: Or<S['p'], IsP<A>, IsP<M>>,
}

type Pipeline<S extends State> = {
    next: <A, M = S['m']>(f:
        | ((a: S['a'], m: S['m']) => A)
        | [(a: S['a'], m: S['m']) => A, (a: S['a'], m: S['m']) => M]
    ) => Pipeline<Compute<Next<S, A, M>>>,
}

type Return<S extends State> = S['p'] extends true ? Promise<S['a']> : S['a']

export type Pipe = <S extends State>(line: (p: Pipeline<Init>) => Pipeline<S>) => Return<S>;

export type Flow = <A, M, S extends State>(line: (p: Pipeline<Compute<Next<Init, A, M>>>) => Pipeline<S>) => (a: A, m: M) => Return<S>;

export type Tap = <A, M>(f: (a: A, m: M) => unknown) => (a: A, m: M) => A;

export type Memo = <A, M, B>(f: (a: A, m: M) => B) => [(a: A, m: M) => A, (a: A, m: M) => B];

export type Exchange = <A, M>() => [(a: A, m: M) => M, (a: A, m: M) => A];

export type Recursive = <A, M, B>(f: (a: A, m: M, r: (a: A, m: M) => B) => B) => (a: A, m: M) => B;
