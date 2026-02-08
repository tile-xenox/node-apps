import type { App } from './types.js';

export const app: App = () => ({
    URI: 'Promise',
    of: (a) => Promise.resolve(a),
    map: (fa, f) => fa.then(f),
    ap: (fab, fa) => fab.then((f) => fa.then(f)),
});
