import type { App, Result } from './types.js';
import type { SemiGroup, Applicative2, Applicative2C } from '../HKT/types.js';
import { isOk, isErr, ok, err } from './__inner__.js';

export const app: App = <E>(se?: SemiGroup<E>): Applicative2<'Result'> | Applicative2C<'Result', E> => ({
    URI: 'Result',
    map: <A, B>(fa: Result<A, E>, f: (a: A) => B) => isOk(fa) ? ok(f(fa.ok)) : fa,
    ap: <A, B>(fab: Result<(a: A) => B, E>, fa: Result<A, E>) => isOk(fab)
        ? (isOk(fa) ? ok(fab.ok(fa.ok)) : fa)
        : (isErr(fa) && typeof se !== 'undefined' ? err(se.concat(fab.err, fa.err)) : fab),
    of: ok,
});
