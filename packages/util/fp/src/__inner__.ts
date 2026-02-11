export type MaybePromise<T> = T | Promise<T>;

export const fp = <A, R>(
    a: MaybePromise<A>,
    f: (a: A) => MaybePromise<R>,
): MaybePromise<R> => a instanceof Promise ? a.then(f) : f(a);

export const tp = <A extends unknown[], R>(
    f: (...args: A) => MaybePromise<R>,
): (...args: A) => Promise<R> => (...args) => Promise.resolve(f(...args));
