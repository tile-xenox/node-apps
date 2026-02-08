import type {
    Ok,
    Err,
    IsOk,
    IsErr,
    Map,
    MapE,
    Get,
    Flat,
    FlatE,
    Filter,
    Try,
    TryS,
    Zip,
    ZipE,
    Flip,
    App,
    Seq,
} from './types.js';
import { ok, err, isOk, isErr } from './__inner__.js';
import { map, mapE } from './map.js';
import { flat, flatE } from './flat.js';
import { get } from './get.js';
import { filter } from './filter.js';
import { try_, tryS } from './try.js';
import { zip, zipE } from './zip.js';
import { flip } from './flip.js';
import { app } from './applicateve.js';
import { seq } from './sequence.js';

export type { Result } from './types.js';

export type R = {
    ok: Ok,
    err: Err,
    isOk: IsOk,
    isErr: IsErr,
    map: Map,
    mapE: MapE,
    get: Get,
    flat: Flat,
    flatE: FlatE,
    filter: Filter,
    try: Try,
    tryS: TryS,
    zip: Zip,
    zipE: ZipE,
    flip: Flip,
    app: App,
    seq: Seq,
};

export const R: R = {
    ok,
    err,
    isOk,
    isErr,
    map,
    mapE,
    flat,
    flatE,
    get,
    filter,
    try: try_,
    tryS,
    zip,
    zipE,
    flip,
    app,
    seq,
};
