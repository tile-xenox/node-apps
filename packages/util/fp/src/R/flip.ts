import type { Flip } from './types.js';
import { isOk, ok, err } from './__inner__.js';

export const flip: Flip = () => (a) => isOk(a) ? err(a.ok) : ok(a.err);
