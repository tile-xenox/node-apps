import type { Seq } from './types.js';
import type { HKT, Applicative } from '../HKT/types.js';

export const seq: Seq = <U>(app: Applicative<U>) => <A>(a: HKT<U, A>[]): HKT<U, A[]> => a.reduce(
    (fas, fa) => app.ap(
        app.map(fas, (as) => (a: A) => [...as, a]),
        fa,
    ),
    app.of<A[]>([]),
);
