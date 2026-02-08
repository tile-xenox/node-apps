import type { Try, TryS } from './types.js';
import { ok, err } from './__inner__.js';

export const try_: Try = (f) => (a, m) => Promise.resolve().then(() => f(a, m)).then(ok, err);

export const tryS: TryS = (f) => (a, m) => {
    try {
        return ok(f(a, m));
    }
    catch (e) {
        return err(e);
    }
};
