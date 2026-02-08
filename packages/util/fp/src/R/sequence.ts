import type { Seq, Result } from './types.js';
import type { HKT, Applicative } from '../HKT/types.js';
import { isOk, ok } from './__inner__.js';

export const seq: Seq = <U>(app: Applicative<U>) => <A, E>(a: Result<HKT<U, A>, E>): HKT<U, Result<A, E>> => isOk(a) ? app.map(a.ok, ok) : app.of(a)
