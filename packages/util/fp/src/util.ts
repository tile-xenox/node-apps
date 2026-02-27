type End =
    | Function
    | RegExp
    | Date
    | Generator<unknown, any, any>
    | { readonly [Symbol.toStringTag]: string; }

type Sub<T> = T extends End ? T : { [K in keyof T]: Sub<T[K]> };

export type Equal<X, Y> = (<T>() => T extends Sub<X> ? 1 : 2) extends (<T>() => T extends Sub<Y> ? 1 : 2) ? true : false;

export type Expect<T extends true> = T

export type IsAny<T> = 1 extends 0 & T ? true : false;

export type IsNever<T> = [T] extends [never] ? true : false;

export type IsUnion<T, S = T> = T extends S ? [S] extends [T] ? false : true : never;

export type Compute<T> = { [K in keyof T]: T[K] } | never;

type UnionArg<T> = T extends unknown ? (arg: T) => void : never;
type UnionReturn<T> = T extends unknown ? () => T : never;

export type Or2And<T> = UnionArg<T> extends (arg: infer A) => void ? A : never;

type LastOf<T> = Or2And<UnionReturn<T>> extends () => infer R ? R : never;
/** @deprecated evil magic */
export type Union2Tuple<T, L = LastOf<T>> = IsNever<T> extends true ? [] : [...Union2Tuple<Exclude<T, L>>, L];

type Primitive = number | string | boolean | symbol;
export type Meta<T extends Primitive, M> = Record<never, M> & T;
export type GetMeta<T> = T extends Record<never, infer M> & T ? M : never;

export interface Fn { I: unknown, O: unknown }

export type Call<F extends Fn, A> = (F & { I: A })['O'];
