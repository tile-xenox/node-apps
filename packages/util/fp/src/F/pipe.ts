import type { Pipe } from  './types.js';
import { fp } from '../__inner__.js';
import type { MaybePromise } from '../types.js';

type C = (a: unknown, m: unknown) => unknown;
type F = C | [C, C];
type P = { fa: F[], next: (f: F) => P };
type S = MaybePromise<{ a: unknown, m: unknown }>;

const p = (fa: F[] = []): P => ({ fa, next: (f) => p([...fa, f]) });

export const pipe: Pipe = (line) => {
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
}
