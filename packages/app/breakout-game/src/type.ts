// game
export type Result = BreakoutGame<''>

// config
// easy, normal, hard, hell
type Mode = 'easy'
// max 20 x 20
type Size = { x: 7, y: 6 }

type Display = {
    block: '🧱',
    ball: '🎱',
    bar: '🟧',
    space: '',
    empty: '🌫',
    gameOver: '💀',
    gameClear: '🎉'
}

type InitState = {
  x: 'add', y: 'sub',
  blocks: [
    { x: 2, y: 4, e: true },
    { x: 3, y: 4, e: true },
    { x: 4, y: 4, e: true },
    { x: 5, y: 4, e: true },
    { x: 6, y: 4, e: true },
    { x: 2, y: 3, e: true },
    { x: 3, y: 3, e: true },
    { x: 4, y: 3, e: true },
    { x: 5, y: 3, e: true },
    { x: 6, y: 3, e: true },
  ],
  ball: { x: 4, y: 1, e: true },
  bars: { '>': 3, '-': 4, '<': 5 },
}


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
            e: S['ball']['e'],
        },
        bars: S['bars'],
    }
    : {
        x: S['x'],
        y: S['y'],
        blocks: S['blocks'],
        ball: Omit<S['ball'], 'e'> & { e: false },
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
    : S['ball']['y'] extends MaxY
        ? S['ball']['x'] extends MinX | MaxX
            ? {
                x: InverseMap[S['x']],
                y: InverseMap[S['y']],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
            : {
                x: S['x'],
                y: InverseMap[S['y']],
                blocks: S['blocks'],
                ball: S['ball'],
                bars: S['bars'],
            }
        : S['ball']['y'] extends MinY
            ? UpdateByBar<S> extends infer T extends State
                ? T['ball']['x'] extends MinX | MaxX
                    ? {
                        x: ({ [P in MinX]: 'add' } & { [P in MaxX]: 'sub' })[T['ball']['x']],
                        y: T['y'],
                        blocks: T['blocks'],
                        ball: T['ball'],
                        bars: T['bars'],
                    }
                    : T
                : never
            : S['ball']['x'] extends MinX | MaxX
                ? {
                    x: InverseMap[S['x']],
                    y: S['y'],
                    blocks: S['blocks'],
                    ball: S['ball'],
                    bars: S['bars'],
                }
                : S

type MoveBall<S extends State> = S['ball']['e'] extends true
    ? {
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
    : S

type DispMinY = 0
type DispY = [DispMinY, ...AxisY]
type DispY_ = DispY[number]

type GetMode<L> = L extends 0 ? 'easy' : Mode

type DispBall = {
    easy: Display['ball'],
    normal: Display['ball'],
    hard: Display['empty'],
    hell: Display['empty'],
}

type DispBlock = {
    easy: Display['block'],
    normal: Display['block'],
    hard: Display['block'],
    hell: Display['empty'],
}

type DispBar = {
    easy: Display['bar'],
    normal: Display['empty'],
    hard: Display['empty'],
    hell: Display['empty'],
}

type Pos<S extends State, L, X extends AxisX_, Y extends DispY_> = S['ball']['e'] extends false
    ? Display['gameOver']
    : S['blocks'][number]['e'] extends false
        ? Display['gameClear']
        : { x: X, y: Y, e: true } extends S['ball']
            ? DispBall[GetMode<L>]
            : { x: X, y: Y, e: true } extends S['blocks'][number]
                ? DispBlock[GetMode<L>]
                : Y extends DispMinY
                    ? X extends S['bars'][BarType]
                        ? DispBar[GetMode<L>]
                        : Display['empty']
                    : Display['empty']

type Merge<T> = {
    [K in keyof T]: T[K]
}

type ShowLine<S extends State, L, Y extends DispY_, X, Acc extends string = ''> = X extends [infer F extends AxisX_, ...infer R]
    ? ShowLine<S, L, Y, R, `${Acc}${Display['space']}${Pos<S, L, F, Y>}`>
    : Acc

type NeedPadZero = DispMinY | MakeAxis<9>[number]
type Key<N extends number> = AxisY_ extends NeedPadZero
    ? `y${N}`
    : N extends NeedPadZero
        ? `y0${N}`
        : `y${N}`

type Show<S extends State, L, Y, Acc = { round: L }> = Y extends [...infer R, infer F extends DispY_]
    ? Show<S, L, R, Acc & { [P in F as Key<P>]: ShowLine<S, L, F, AxisX> }>
    : Acc

export type BreakoutGame<
    L extends string,
    S extends State = InitState,
    T extends unknown[] = [],
> = L extends `${infer C extends Command}${infer R}`
    ? BreakoutGame<R, MoveBall<CheckConflict<UpdateBarMap<S>[C] & State>> & State, [...T, unknown]>
    : Merge<Show<S, T['length'], DispY>>
