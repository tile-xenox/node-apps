import type { Map, MapE } from './types.js';
import { isOk, ok, isErr, err } from './__inner__.js';

export const map: Map = (f) => (a, m) => isOk(a) ? ok(f(a.ok, m)) : a;

export const mapE: MapE = (f) => (a, m) => isErr(a) ? err(f(a.err, m)) : a;
