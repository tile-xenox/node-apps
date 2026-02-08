import type {
    Pipe,
    Flow,
    Tap,
    Memo,
    Exchange,
    Recursive,
} from './types.js';
import { pipe } from './pipe.js';
import { flow } from './flow.js';
import { tap } from './tap.js';
import { memo } from './memo.js';
import { exchange } from './exchange.js';
import { recursive } from './recursive.js';

export type F = {
    pipe: Pipe,
    flow: Flow,
    tap: Tap,
    memo: Memo,
    exchange: Exchange,
    recursive: Recursive,
}

export const F: F = {
    pipe,
    flow,
    tap,
    memo,
    exchange,
    recursive,
};
