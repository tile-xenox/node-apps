import type {
    HKT,
    Applicative,
    SequenceS,
} from "./HKT";

const seq: SequenceS = <U>(app: Applicative<U>) => ((r: Record<string, HKT<U, any>>): HKT<U, Record<string, any>> => {
    const entries1 = Object.entries(r);
    const entries2: [string, any][] = [];
    const f = (val: any): any => {
        const [key] = entries1[entries2.length];
        entries2.push([key, val]);
        return entries1.length === entries2.length ? Object.entries(entries2) : f;
    };
    const [kv, ...rest] = entries1;
    return kv
        ? rest.reduce((p, [, c]) => app.ap(p, c), app.map(kv[1], f))
        : app.of({});
}) as never;

export type S = { seq: SequenceS };

export const S: S = { seq };
