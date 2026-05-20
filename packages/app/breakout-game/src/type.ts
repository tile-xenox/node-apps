// config
type Size = { x: 5, y: 5 }

type InitState = {
  x: 'add', y: 'sub',
  blocks: [
    { x: 2, y: 4, e: true },
    { x: 3, y: 4, e: true },
    { x: 4, y: 4, e: true },
    { x: 2, y: 3, e: true },
    { x: 3, y: 3, e: true },
    { x: 4, y: 3, e: true },
  ],
  ball: { x: 3, y: 1, e: true },
  bars: { '>': 2, '-': 3, '<': 4 },
}

type Display = {
    block: '🧱',
    ball: '🎱',
    space: '',
    empty: '🌫',
    gameOver: '💀',
    gameClear: '🎉'
}

// game

type Result = BreakoutGame<''>


// program
type MakeAxis<N, Acc extends unknown[] = [unknown]> = Acc['length'] extends N
    ? [Acc['length']]
    : [Acc['length'], ...MakeAxis<N, [...Acc, unknown]>]

type AxisY = MakeAxis<Size['y']>
type AxisX = MakeAxis<Size['x']>

type AxisY_ = AxisY[number]
type AxisX_ = AxisX[number]

type AddMap = {
    0: 1,
    1: 2,
    2: 3,
    3: 4,
    4: 5,
    5: 6,
    6: 7,
    7: 8,
    8: 9,
    9: 10,
    10: 11,
    11: 12,
    12: 13,
    13: 14,
    14: 15,
    15: 16,
    16: 17,
    17: 18,
    18: 19,
    19: 20,
    20: 21,
    21: 21,
}

type SubMap = {
    0: 0,
    1: 0,
    2: 1,
    3: 2,
    4: 3,
    5: 4,
    6: 5,
    7: 6,
    8: 7,
    9: 8,
    10: 9,
    11: 10,
    12: 11,
    13: 12,
    14: 13,
    15: 14,
    16: 15,
    17: 16,
    18: 17,
    19: 18,
    20: 19,
    21: 20,
}

type BarMin = Exclude<SubMap[AxisX_], AxisX_>
type BarMax = Exclude<AddMap[AxisX_], AxisX_>

type AxisB = BarMin | AxisX_ | BarMax

type MinX = Exclude<AxisX_, AddMap[AxisX_]>
type MaxX = Exclude<AxisX_, SubMap[AxisX_]>

type MinY = Exclude<AxisY_, AddMap[AxisY_]>
type MaxY = Exclude<AxisY_, SubMap[AxisY_]>

type InverseMap = {
    add: 'sub',
    sub: 'add',
}
type Direction = keyof InverseMap

type Command = '<' | '-' | '>'
type BarType = '>' | '-' | '<'

type State = {
    x: Direction,
    y: Direction,
    blocks: { x: AxisX_, y: AxisY_, e: boolean }[],
    ball: { x: AxisX_, y: AxisY_, e: boolean },
    bars: Record<BarType, AxisB>,
};

type MoveLeft<S extends State> = BarMin extends S['bars'][BarType]
    ? S
    : {
        x: S['x'],
        y: S['y'],
        blocks: S['blocks'],
        ball: S['ball'],
        bars: {
            [K in BarType]: SubMap[S['bars'][K]]
        },
    }

type MoveRight<S extends State> = BarMax extends S['bars'][BarType]
    ? S
    : {
        x: S['x'],
        y: S['y'],
        blocks: S['blocks'],
        ball: S['ball'],
        bars: {
            [K in BarType]: AddMap[S['bars'][K]]
        },
    }

type UpdateBarMap<S extends State> = {
    '<': MoveLeft<S>,
    '-': S,
    '>': MoveRight<S>,
}

type GetBarType<T extends BarType, S extends State> = T extends unknown
    ? S['bars'][T] extends S['ball']['x']
        ? T
        : never
    : never

type UpdateByBar<S extends State> = S['ball']['x'] extends S['bars'][BarType]
    ? {
        x: S['x'],
        y: InverseMap[S['y']],
        blocks: S['blocks'],
        ball: {
            x: {
                '<': SubMap[S['ball']['x']],
                '-': S['ball']['x'],
                '>': AddMap[S['ball']['x']],
            }[GetBarType<BarType, S>],
            y: S['ball']['y'],
            e: true,
        },
        bars: S['bars'],
    }
    : {
        x: S['x'],
        y: S['y'],
        blocks: S['blocks'],
        ball: {
            x: S['ball']['x'],
            y: S['ball']['y'],
            e: false,
        },
        bars: S['bars'],
    }


type RemoveBlock<T extends State['blocks'], B extends State['ball']> = {
    [K in keyof T]: T[K] extends B ? Omit<T[K], 'e'> & { e: false } : T[K]
}

type CheckConflict<S extends State> = S['ball'] extends S['blocks'][number]
    ? {
        x: InverseMap[S['x']],
        y: InverseMap[S['y']],
        blocks: RemoveBlock<S['blocks'], S['ball']>,
        ball: S['ball'],
        bars: S['bars'],
    }
    : S['ball']['x'] extends MinX | MaxX
        ? S['ball']['y'] extends MaxY
            ? {
                x: InverseMap[S['x']],
                y: InverseMap[S['y']],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
            : S['ball']['y'] extends MinY
                ? UpdateByBar<{
                    x: InverseMap[S['x']],
                    y: S['y'],
                    blocks: S['blocks'],
                    ball: S['ball'],
                    bars: S['bars'],
                }>
                : {
                    x: InverseMap[S['x']],
                    y: S['y'],
                    blocks: S['blocks'],
                    ball: S['ball'],
                    bars: S['bars'],
                }
        : S['ball']['y'] extends MaxY
            ? {
                x: S['x'],
                y: InverseMap[S['y']],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
            : S['ball']['y'] extends MinY
                ? UpdateByBar<S>
                : S

type MoveBall<S extends State> = {
    x: S['x'],
    y: S['y'],
    blocks: S['blocks'],
    ball: {
        x: {
            add: AddMap[S['ball']['x']],
            sub: SubMap[S['ball']['x']],
        }[S['x']],
        y: {
            add: AddMap[S['ball']['y']],
            sub: SubMap[S['ball']['y']],
        }[S['y']],
        e: true,
    },
    bars: S['bars'],
}

type UpdateState<S extends State, C extends Command> = S['ball']['e'] extends true
    ? MoveBall<CheckConflict<UpdateBarMap<S>[C] & State> & State>
    : S

type Pos<S extends State, X extends AxisX_, Y extends AxisY_> = S['ball']['e'] extends false
    ? Display['gameOver']
    : S['blocks'][number]['e'] extends false
        ? Display['gameClear']
        : { x: X, y: Y, e: true } extends S['ball']
            ? Display['ball']
            : { x: X, y: Y, e: true } extends S['blocks'][number]
                ? Display['block']
                : Display['empty']

type Merge<T> = {
    [K in keyof T]: T[K]
}

type ShowLine<S extends State, Y extends AxisY_, X, Acc extends string = ''> = X extends [infer F extends AxisX_, ...infer R]
    ? ShowLine<S, Y, R, `${Acc}${Display['space']}${Pos<S, F, Y>}`>
    : Acc

type NeedPadZero = MakeAxis<9>[number]
type Key<N extends number> = AxisY_ extends NeedPadZero
    ? `y${N}`
    : N extends NeedPadZero
        ? `y0${N}`
        : `y${N}`

type Show<S extends State, Y, Acc = {}> = Y extends [...infer R, infer F extends AxisY_]
    ? Show<S, R, Acc & { [P in F as Key<P>]: ShowLine<S, F, AxisX> }>
    : Acc

export type BreakoutGame<
    L extends string,
    S extends State = InitState,
    T extends unknown[] = [],
> = L extends `${infer C extends Command}${infer R}`
    ? BreakoutGame<R, UpdateState<S, C> & State, [...T, unknown]>
    : Merge<Show<S, AxisY, { round: T['length'] }>>
