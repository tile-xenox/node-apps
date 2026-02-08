import type {
    Map,
    Filter,
    Reduce,
    Find,
    FlatMap,
    Every,
    Some,
    Sort,
    GroupBy,
    Tuple,
    Zip,
    SemiG,
    App,
    Seq
} from './types.js';
import { map } from './map.js';
import { filter } from './filter.js';
import { reduce } from './reduce.js';
import { find } from './find.js';
import { flatMap } from './flatMap.js';
import { every } from './every.js';
import { some } from './some.js';
import { sort } from './sort.js';
import { groupBy } from './groupBy.js';
import { tuple } from './tuple.js';
import { zip } from './zip.js';
import { semiG } from './semiGroup.js';
import { app } from './applicative.js';
import { seq } from './sequesce.js';

export type A = {
    map: Map,
    filter: Filter,
    reduce: Reduce,
    find: Find,
    flatMap: FlatMap,
    every: Every,
    some: Some,
    sort: Sort,
    groupBy: GroupBy,
    tuple: Tuple,
    zip: Zip,
    semiG: SemiG,
    app: App,
    seq: Seq,
};

export const A: A = {
    map,
    filter,
    reduce,
    find,
    flatMap,
    every,
    some,
    sort,
    groupBy,
    tuple,
    zip,
    semiG,
    app,
    seq,
};
