import type { Flat, FlatE } from './types.js';
import { isOk, isErr } from './__inner__.js';

export const flat: Flat = () => (a) => isOk(a) ? a.ok : a;

export const flatE: FlatE = () => (a) => isErr(a) ? a.err : a;
