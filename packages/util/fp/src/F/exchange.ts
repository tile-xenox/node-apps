import type { Exchange } from './types.js';

export const exchange: Exchange = () => [
    (_, m) => m,
    (a) => a,
];
