import { tp, type MaybePromise } from "./__inner__";
import type { Applicative1 } from "./HKT";

type Tap = <A, M>(f: (a: A, m: M) => MaybePromise<unknown>) => (a: A, m: M) => Promise<A>;
const tap: Tap = (f) => (a, m) => tp(f)(a, m).then(() => a);


type App = () => Applicative1<'Promise'>;
const app: App = () => ({
    URI: 'Promise',
    of: (a) => Promise.resolve(a),
    map: (fa, f) => fa.then(f),
    ap: (fab, fa) => fab.then((f) => fa.then(f)),
});


export type P = {
    tap: Tap,
    app: App,
};

export const P: P = {
    tap,
    app,
};
