import type { SemiG } from './types.js';

export const semiG: SemiG = () => ({
    concat: (a, b) => [...a, ...b],
});
