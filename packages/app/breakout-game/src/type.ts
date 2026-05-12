type Axis = 1 | 2 | 3 | 4 | 5
type BarAxis = 0 | 1 | 2 | 3 | 4 | 5 | 6
type Wall = 1 | 5
type Velocity = 'add' | 'sub'
type Command = '<' | '-' | '>'

type Add<T extends BarAxis> = {
    0: 1
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: never
}[T]

type Sub<T extends BarAxis> = {
    0: never,
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
}[T]

type State = {
    direction: [Velocity, Velocity],
    blocks: { x: Axis, y: Axis, e: boolean }[],
    ball: { x: Axis, y: Axis, e: boolean },
    bars: Record<Command, BarAxis>,
};

type Inverse<V extends Velocity> = {
    'add': 'sub',
    'sub': 'add',
}[V]

type InitState = {
  direction: ['add', 'sub'],
  blocks: [
    { x: 2, y: 4, e: true },
    { x: 3, y: 4, e: true },
    { x: 4, y: 4, e: true },
    { x: 2, y: 3, e: true },
    { x: 3, y: 3, e: true },
    { x: 4, y: 3, e: true },
  ],
  ball: {
    x: 3,
    y: 1,
    e: true,
  },
  bars: {
    '>': 2
    '-': 3,
    '<': 4
  },
}

type UpdateBars<S extends State, C extends Command> = {
    '<': 0 extends S['bars'][Command]
        ? S
        : {
            direction: S['direction'],
            blocks: S['blocks'],
            ball: S['ball'],
            bars: { [K in keyof S['bars']]: Sub<S['bars'][K] & Axis> }
        },
    '-': S,
    '>': 6 extends S['bars'][Command]
        ? S
        : {
            direction: S['direction'],
            blocks: S['blocks'],
            ball: S['ball'],
            bars: { [K in keyof S['bars']]: Add<S['bars'][K] & Axis> }
        },
}[C]

type RemoveBlock<T extends State['blocks'], B extends State['ball']> = {
    [K in keyof T]: T[K] extends B ? Omit<T[K], 'e'> & { e: false } : T[K]
}

type GetBarType<C extends Command, S extends State> = C extends unknown
    ? S['bars'][C] extends S['ball']['x']
        ? C
        : never
    : never

type UpdateByBar<S extends State> = S['ball']['x'] extends S['bars'][Command]
    ? {
        direction: [S['direction'][0], Inverse<S['direction'][1]>]
        blocks: S['blocks'],
        ball: {
            x: {
                '<': Sub<S['ball']['x']>,
                '-': S['ball']['x'],
                '>': Add<S['ball']['x']>,
            }[GetBarType<Command, S>],
            y: S['ball']['y'],
            e: true,
        },
        bars: S['bars'],
    }
    : {
        direction: S['direction'],
        blocks: S['blocks'],
        ball: {
            x: S['ball']['x'],
            y: S['ball']['y'],
            e: false,
        },
        bars: S['bars'],
    }

type CheckConflict<S extends State> = S['ball'] extends S['blocks'][number]
    ? {
        direction: [Inverse<S['direction'][0]>, Inverse<S['direction'][1]>],
        blocks: RemoveBlock<S['blocks'], S['ball']>,
        ball: S['ball'],
        bars: S['bars'],
    }
    : S['ball']['x'] extends Wall
        ? S['ball']['y'] extends 5
            ? {
                direction: [Inverse<S['direction'][0]>, Inverse<S['direction'][1]>],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
            : S['ball']['y'] extends 1
                ? UpdateByBar<{
                    direction: [Inverse<S['direction'][0]>, S['direction'][1]],
                    blocks: S['blocks'],
                    ball: S['ball'],
                    bars: S['bars'],
                }>
                : {
                    direction: [Inverse<S['direction'][0]>, S['direction'][1]],
                    blocks: S['blocks'],
                    ball: S['ball'],
                    bars: S['bars'],
                }
        : S['ball']['y'] extends 5
            ? {
                direction: [S['direction'][0], Inverse<S['direction'][1]>],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
            : S['ball']['y'] extends 1
                ? UpdateByBar<S>
                : S

type MoveBall<S extends State> = {
    direction: S['direction'],
    blocks: S['blocks'],
    ball: {
        x: { 'add': Add<S['ball']['x']>, 'sub': Sub<S['ball']['x']> }[S['direction'][0]],
        y: { 'add': Add<S['ball']['y']>, 'sub': Sub<S['ball']['y']> }[S['direction'][1]],
        e: true,
    },
    bars: S['bars'],
}

type UpdateState<S extends State, C extends Command> = S['ball']['e'] extends true
    ? MoveBall<CheckConflict<UpdateBars<S, C> & State> & State>
    : S

type Pos<S extends State, P extends [Axis, Axis]> = S['ball']['e'] extends false
    ? 'x'
    : S['blocks'][number]['e'] extends false
        ? 'o'
        : { x: P[0], y: P[1], e: true } extends S['ball']
            ? 'o'
            : { x: P[0], y: P[1], e: true } extends S['blocks'][number]
                ? '+'
                : '-'

type Show<S extends State> = {
  5: `${Pos<S, [1, 5]>} ${Pos<S, [2, 5]>} ${Pos<S, [3, 5]>} ${Pos<S, [4, 5]>} ${Pos<S, [5, 5]>}`
  4: `${Pos<S, [1, 4]>} ${Pos<S, [2, 4]>} ${Pos<S, [3, 4]>} ${Pos<S, [4, 4]>} ${Pos<S, [5, 4]>}`
  3: `${Pos<S, [1, 3]>} ${Pos<S, [2, 3]>} ${Pos<S, [3, 3]>} ${Pos<S, [4, 3]>} ${Pos<S, [5, 3]>}`
  2: `${Pos<S, [1, 2]>} ${Pos<S, [2, 2]>} ${Pos<S, [3, 2]>} ${Pos<S, [4, 2]>} ${Pos<S, [5, 2]>}`
  1: `${Pos<S, [1, 1]>} ${Pos<S, [2, 1]>} ${Pos<S, [3, 1]>} ${Pos<S, [4, 1]>} ${Pos<S, [5, 1]>}`
}

export type BreakoutGame<
    C extends string,
    S extends State = InitState,
> = C extends `${infer F extends Command}${infer R}`
    ? BreakoutGame<R, UpdateState<S, F> & State>
    : Show<S>

// <---->>--
// <---->----->----------<---------->------->------------
type Check = BreakoutGame<'<---->----->----------<---------->------->-'>
