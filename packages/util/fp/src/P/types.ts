import type { Applicative1 } from '../HKT/types.js';

export type Tap = <A, M>(f: (a: A, m: M) => Promise<unknown>) => (a: A, m: M) => Promise<A>;

export type App = () => Applicative1<'Promise'>;
