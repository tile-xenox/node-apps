import type { Map } from './types.js';

export const map: Map = (f) => (a, m) => a.map((e, i) => f(e, i, m));
