import type { MaybePromise } from './types.js';

export const fp = <A, R>(a: MaybePromise<A>, f: (a: A) => MaybePromise<R>): MaybePromise<R> => a instanceof Promise
    ? a.then(f)
    : f(a);
