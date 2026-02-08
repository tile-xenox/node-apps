import type { Flow } from './types.js';
import { pipe } from './pipe.js';

export const flow: Flow = (line) => (a, m) => pipe((p) => line(p.next([() => a, () => m])));
