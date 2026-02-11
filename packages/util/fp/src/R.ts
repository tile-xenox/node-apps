import type {
    SemiGroup,
    HKT,
    Applicative,
    Applicative2,
    Applicative2C,
    Sequence2,
    Sequence2E,
} from './HKT.js';

const $ok = Symbol();
const $err = Symbol();

type Right<V> = { __type: typeof $ok, ok: V };
type Left<V> = { __type: typeof $err, err: V };

export type Result<A, E> = Right<A> | Left<E>;

type IsOk = <A, E>(r: Result<A, E>) => r is Right<A>;
const isOk: IsOk = (r) => r.__type === $ok;


type IsErr = <A, E>(r: Result<A, E>) => r is Left<E>;
const isErr: IsErr = (r) => r.__type === $err;


type Ok = <A = never, E = never>(a: A) => Result<A, E>;
const ok: Ok = (a) => ({ __type: $ok, ok: a });


type Err = <A = never, E = never>(e: E) => Result<A, E>;
const err: Err = (e) => ({ __type: $err, err: e });


type Map = <A, M, B>(f: (a: A, m: M) => B) => <E>(a: Result<A, E>, m: M) => Result<B, E>;
const map: Map = (f) => (a, m) => isOk(a) ? ok(f(a.ok, m)) : a;


type MapE = <E, M, F>(f: (e: E, m: M) => F) => <A>(a: Result<A, E>, m: M) => Result<A, F>;
const mapE: MapE = (f) => (a, m) => isErr(a) ? err(f(a.err, m)) : a;


type Flat = <A, E, F>(a: Result<Result<A, E>, F>) => Result<A, E | F>;
const flat: Flat = (a) => R.isOk(a) ? a.ok : a;


type FlatE = <A, B, E>(a: Result<A, Result<B, E>>) => Result<A | B, E>;
const flatE: FlatE = (a) => isErr(a) ? a.err : a;


type FlatMap = <A, B, F, M>(f: (a: A, m: M) => Result<B, F>) => <E>(a: Result<A, E>, m: M) => Result<B, E | F>;
const flatMap: FlatMap = (f) => (a, m) => flat(map(f)(a, m));


type FlatMapE = <B, E, F, M>(f: (a: E, m: M) => Result<B, F>) => <A>(a: Result<A, E>, m: M) => Result<A | B, F>;
const flatMapE: FlatMapE = (f) => (a, m) => flatE(mapE(f)(a, m));


type Get = <B, E, M>(f: (e: E, m: M) => B) => <A>(a: Result<A, E>, m: M) => A | B;
const get: Get = (f) => (a, m) => isErr(a) ? f(a.err, m) : a.ok;


type Filter = {
    <A, M, B extends A>(f: (a: A, m: M) => a is B): (a: A, m: M) => Result<B, Exclude<A, B>>;
    <A, M>(f: (a: A, m: M) => boolean): (a: A, m: M) => Result<A, A>;
}
const filter: Filter = <A, M>(f: (a: A, m: M) => boolean) => (a: A, m: M) => (f(a, m) ? ok(a) : err(a)) as never;


type Try = <A, M, B>(f: (a: A, m: M) => B) => (a: A, m: M) => Result<B, unknown>;
const try_: Try = (f) => (a, m) => {
    try {
        return ok(f(a, m));
    }
    catch (e) {
        return err(e);
    }
};


type Zip = <A, B, C>(f: (a: A, b: B) => C) => <E, F>(a: Result<A, E>, m: Result<B, F>) => Result<C, E | F>;
const zip: Zip = (f) => (a, m) => isOk(a) ? (isOk(m) ? ok(f(a.ok, m.ok)) : m) : a;


type ZipE = <E, F, G>(f: (a: E, b: F) => G) => <A, B>(a: Result<A, E>, m: Result<B, F>) => Result<A | B, G>;
const zipE: ZipE = (f) => (a, m) => isErr(a) ? (isErr(m) ? err(f(a.err, m.err)) : m) : a;


type Flip = <A, E>() => (a: Result<A, E>) => Result<E, A>;
const flip: Flip = () => (a) => isOk(a) ? err(a.ok) : ok(a.err);


type App = {
    (): Applicative2<'Result'>;
    <E>(se: SemiGroup<E>): Applicative2C<'Result', E>;
};
const app: App = <E>(se?: SemiGroup<E>): Applicative2<'Result'> | Applicative2C<'Result', E> => ({
    URI: 'Result',
    map: <A, B>(fa: Result<A, E>, f: (a: A) => B) => isOk(fa) ? ok(f(fa.ok)) : fa,
    ap: <A, B>(fab: Result<(a: A) => B, E>, fa: Result<A, E>) => isOk(fab)
        ? (isOk(fa) ? ok(fab.ok(fa.ok)) : fa)
        : (isErr(fa) && se ? err(se.concat(fab.err, fa.err)) : fab),
    of: ok,
});


type Seq = Sequence2<'Result'>;
const seq: Seq = <U>(app: Applicative<U>) => <A, E>(a: Result<HKT<U, A>, E>): HKT<U, Result<A, E>> => isOk(a) ? app.map(a.ok, ok) : app.of(a);


type SeqE = Sequence2E<'Result'>;
const seqE: SeqE = <U>(app: Applicative<U>) => <A, E>(a: Result<A, HKT<U, E>>): HKT<U, Result<A, E>> => isErr(a) ? app.map(a.err, err) : app.of(a);


export type R = {
    ok: Ok,
    err: Err,
    isOk: IsOk,
    isErr: IsErr,
    map: Map,
    mapE: MapE,
    get: Get,
    flat: Flat,
    flatE: FlatE,
    flatMap: FlatMap,
    flatMapE: FlatMapE,
    filter: Filter,
    try: Try,
    zip: Zip,
    zipE: ZipE,
    flip: Flip,
    app: App,
    seq: Seq,
    seqE: SeqE,
};

export const R: R = {
    ok,
    err,
    isOk,
    isErr,
    map,
    mapE,
    flat,
    flatE,
    flatMap,
    flatMapE,
    get,
    filter,
    try: try_,
    zip,
    zipE,
    flip,
    app,
    seq,
    seqE,
};
