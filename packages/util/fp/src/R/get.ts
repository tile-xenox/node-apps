import type { Get } from './types.js';
import { isErr } from './__inner__.js';

export const get: Get = (f) => (a, m) => isErr(a) ? f(a.err, m) : a.ok;
