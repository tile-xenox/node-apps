import { Filter } from './types.js';
import { ok, err } from './__inner__.js';
import { fp } from '../__inner__.js';
import type { MaybePromise } from '../types.js';

export const filter: Filter = <A, M>(f: (a: A, m: M) => MaybePromise<boolean>) => (a: A, m: M) => fp(
    f(a, m),
    (b) => b ? ok(a) : err(a),
) as never;
