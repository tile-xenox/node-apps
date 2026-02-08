import type { Tap, App } from './types.js';
import { tap } from './tap.js';
import { app } from './applicative.js';

export type P = {
    tap: Tap,
    app: App,
}

export const P: P = {
    tap,
    app,
};
