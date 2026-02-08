import type { App } from './types.js';

export const app: App = () => ({
    URI: 'Array',
    map: (fa, f) => fa.map(f),
    ap: (fab, fa) => fab.flatMap((f) => fa.map(f)),
    of: (a) => [a],
});
