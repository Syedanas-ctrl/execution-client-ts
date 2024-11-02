import { Decoded, NestedUint8Array } from "./types";
import { decodeItem } from "./utils";

/**
 * Decodes an RLP encoded Uint8Array
 * 
 * @param input - The input Uint8Array to decode
 * @param stream - Whether to return a Decoded object (true) or a Uint8Array or NestedUint8Array (false)
 * @returns The decoded data
 */
export function rlpDecode(input: Uint8Array, stream?: false): Uint8Array | NestedUint8Array
export function rlpDecode(input: Uint8Array, stream?: true): Decoded
export function rlpDecode(input: Uint8Array, stream = false): Uint8Array | NestedUint8Array | Decoded {
    if (typeof input === 'undefined' || input === null || (input as any).length === 0) {
        return Uint8Array.from([])
    }
    
    const [decoded, remainderIndex] = decodeItem(input, 0);

    if (stream) {
        return {
            data: decoded,
            remainder: input.slice(remainderIndex),
        }
    }

    return decoded;
}