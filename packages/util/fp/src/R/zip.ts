import type { Zip, ZipE } from './types.js';
import { isOk, isErr, ok, err } from './__inner__.js';

export const zip: Zip = (f) => (a, m) => isOk(a) ? (isOk(m) ? ok(f(a.ok, m.ok)) : m) : a;

export const zipE: ZipE = (f) => (a, m) => isErr(a) ? (isErr(m) ? err(f(a.err, m.err)) : m) : a;
