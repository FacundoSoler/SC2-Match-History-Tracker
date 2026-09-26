declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B }

export type Realm = Brand<number, 'Realm'>;

export const Realms = {
    ONE: 1 as Realm,
    TWO: 2 as Realm
} as const;