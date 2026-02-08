import type { IsOk, IsErr, Ok, Err } from './types.js';

const $ok = Symbol();
const $err = Symbol();

export type Right<V> = { __type: typeof $ok, ok: V }
export type Left<V> = { __type: typeof $err, err: V }

export const isOk: IsOk = (r) => r.__type === $ok;
export const isErr: IsErr = (r) => r.__type === $err;

export const ok: Ok = (a) => ({ __type: $ok, ok: a });
export const err: Err = (e) => ({ __type: $err, err: e });
