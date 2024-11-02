import { FixedBytes, BlockHash, PrefixedHexString, N256, N64 } from "../../primitives/src/types";

export type RLPInput =
    | string
    | FixedBytes<number>
    | N64
    | N256
    | BlockHash
    | PrefixedHexString
    | Uint8Array
    | RLPInput[]
    | null
    | undefined;

export type NestedUint8Array = Array<Uint8Array | NestedUint8Array>

export interface Decoded {
    data: Uint8Array | NestedUint8Array
    remainder: Uint8Array
}

