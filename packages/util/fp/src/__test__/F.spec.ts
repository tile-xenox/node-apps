import { describe, test, expect } from 'vitest';
import { F } from '../index.js';

describe('F', () => {
    test('pipe', async() => {
        const actual = F.pipe(
            (p) => p
                .next(() => Promise.resolve('aaa'))
                .next((a) => a.length)
                .next((n) => n * 2)
        )

        const expected = 6;

        expect(await actual).toBe(expected);
    });

    test('tap', () => {
        const actual = F.pipe(
            (p) => p
                .next(() => 2)
                .next(F.tap((a) => a * 3))
                .next((a) => a + 1)
                .next((a) => a * 4),
        );

        const expected = 12;

        expect(actual).toBe(expected);
    });

    test('memo', () => {
        const actual = F.pipe(
            (p) => p
                .next(() => 2)
                .next(F.memo((a) => a * 3))
                .next((a) => a + 1)
                .next((a) => a * 4)
                .next((a, b) => a + b),
        );

        const expected = 18;

        expect(actual).toBe(expected);
    });

    test('exchange', () => {
        const actual = F.pipe(
            (p) => p
                .next(() => 2)
                .next(F.memo((a) => 'abc'.repeat(a)))
                .next(F.exchange())
                .next((a) => a.length)
                .next((a, b) => a + b)
        );

        const expected = 8;

        expect(actual).toBe(expected);
    });

    test('flow', () => {
        const actual = F.pipe(
            (p) => p
                .next(() => 2)
                .next(F.memo(F.flow(
                    (p) => p
                        .next(F.memo((a) => a * 2))
                        .next((a, m) => a + m)
                )))
                .next(F.flow(
                    (p) => p
                        .next((a) => a - 1)
                        .next(F.memo((a, m) => `${a}`.repeat(m)))
                        .next(F.exchange())
                        .next((a, m) => `${a}-${m}`)
                ))
                .next((a, m) => `${m}: ${a}`)
        );

        const expected = '6: 111111-1';

        expect(actual).toBe(expected);
    });

    test('recursive', () => {
        const actual = F.pipe(
            (p) => p
                .next(() => 5)
                .next(F.memo(F.recursive((a, { m, r }): number => a === 0 ? 1 : a * r(a - 1, m))))
                .next((a, m) => a + m)
        );

        const expected = 125;

        expect(actual).toBe(expected);
    });
});
