import { toBytes } from "./bytes";
import { isHexString } from "./helpers";

// create fixed-size byte arrays
type FixedBytes<N extends number> = Uint8Array & { length: N };


// Create a fixed-size byte array from a hex string
function createFixedBytes<N extends number>(hex: string, length: N): FixedBytes<N> {
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }
    if (hex.length !== length * 2) {
        throw new Error(`Invalid hex string length for FixedBytes<${length}>`);
    }
    const buffer = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        buffer[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return buffer as FixedBytes<N>;
}

// Convert a fixed-size byte array to a hex string
function fixedBytesToHex<N extends number>(bytes: FixedBytes<N>): string {
    return '0x' + Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function createByteArrayClass(byteLength: number) {
    return class extends Uint8Array {
        constructor(input?: string | Uint8Array) {
            if (!input) {
                super(byteLength);
                return;
            }

            if (typeof input === 'string') {
                const bytes = createFixedBytes(input, byteLength);
                super(bytes);
            } else if (input instanceof Uint8Array) {
                if (input.length !== byteLength) {
                    throw new Error(`${byteLength} bytes required`);
                }
                super(input);
            } else {
                throw new Error(`Invalid input type for ${byteLength} bytes`);
            }
        }

        toString(): string {
            return fixedBytesToHex(this);
        }
    }
}

// integer types
export type N8 = number;
export type N16 = number;
export type N32 = number;
export type N64 = bigint;
export type N128 = bigint;
export type N256 = bigint;

// fixed-size byte array types
export class B8 extends createByteArrayClass(1) {}
export class B16 extends createByteArrayClass(2) {}
export class B32 extends createByteArrayClass(4) {}
export class B64 extends createByteArrayClass(8) {}
export class B96 extends createByteArrayClass(12) {}
export class B128 extends createByteArrayClass(16) {}
// type B160 = FixedBytes<20>;
export class B160 extends createByteArrayClass(20) {}
export class B192 extends createByteArrayClass(24) {}
export class B224 extends createByteArrayClass(28) {}
export class B256 extends createByteArrayClass(32) {}
export class B512 extends createByteArrayClass(64) {}
export class B1024 extends createByteArrayClass(128) {}
export class B2048 extends createByteArrayClass(256) {}

// Ethereum-specific types
export class BlockHash extends B256{};
export type BlockNumber = N64;
export type BlockTimestamp = N64;
export class TxHash extends B256{};
export type TxNumber = N64;
export type TxNonce = N64;
export type TxIndex = N64;
export type ChainId = N64;
export type StorageKey = B256;
export type StorageValue = N256;
export type Selector = FixedBytes<4>;
export type PrefixedHexString = `0x${string}`;


export enum TypeOutput {
    Number,
    BigInt,
    Uint8Array,
    PrefixedHexString,
    N8, N16, N32, N64, N128, N256,
    B8, B16, B32, B64, B96, B128, B160, B192, B224, B256, B512, B1024, B2048,
}

// export type TypeOutputReturnType = {
//     [TypeOutput.Number]: number
//     [TypeOutput.BigInt]: bigint
//     [TypeOutput.Uint8Array]: Uint8Array
//     [TypeOutput.PrefixedHexString]: PrefixedHexString,
//     [TypeOutput.N8]: N8,
//     [TypeOutput.N16]: N16,
//     [TypeOutput.N32]: N32,
//     [TypeOutput.N64]: N64,
//     [TypeOutput.N128]: N128,
//     [TypeOutput.N256]: N256,
//     [TypeOutput.B8]: B8,
//     [TypeOutput.B16]: B16,
//     [TypeOutput.B32]: B32,
//     [TypeOutput.B64]: B64,
//     [TypeOutput.B96]: B96,
//     [TypeOutput.B128]: B128,
//     [TypeOutput.B160]: B160,
//     [TypeOutput.B192]: B192,
//     [TypeOutput.B224]: B224,
//     [TypeOutput.B256]: B256,
//     [TypeOutput.B512]: B512,
//     [TypeOutput.B1024]: B1024,
//     [TypeOutput.B2048]: B2048,
// }

// export interface TransformableToBytes {
//     toBytes?(): Uint8Array
// }

export type ToBytesInputTypes =
    | PrefixedHexString
    | Uint8Array
    | null
    | undefined
    | B256 | B160 | B128 | B64 | B32 | B16
    | number
    | bigint
    | number[]

export function toType<T extends TypeOutput>(input: null, outputType: T): null
export function toType<T extends TypeOutput>(input: undefined, outputType: T): undefined
export function toType<T extends TypeOutput>(
    input: ToBytesInputTypes,
    outputType: T,
): TypeOutputReturnType[T] | undefined | null {
    if (input === null || input === undefined)
        return input
    if (typeof input === 'string' && !isHexString(input)) {
        throw new Error(`A string must be provided with a 0x-prefix, given: ${input}`)
    } else if (typeof input === 'number' && !Number.isSafeInteger(input)) {
        throw new Error(
            'The provided number is greater than MAX_SAFE_INTEGER (please use an alternative input type)',
        )
    }

    const output = toBytes(input)
}
