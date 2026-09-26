declare const brand: unique symbol;
type Brand<T, B> = T & { readonly [brand]: B }

export type Region = Brand<number, 'Region'>;
export type RegionKey = keyof typeof Regions; // "US" | "EU" | "KR"

export const Regions = {
    US: 1 as Region,
    EU: 2 as Region,
    KR: 3 as Region
} as const;

export function isRegionKey(key: string): key is RegionKey {
    return key in Regions;
}