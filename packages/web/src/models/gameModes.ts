declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B }

export type GameMode = Brand<number, 'GameMode'>;

export const GameModes = {
    '1v1': 201 as GameMode,
    '2v2': 202 as GameMode,
    '3v3': 203 as GameMode,
    '4v4': 204 as GameMode
} as const;