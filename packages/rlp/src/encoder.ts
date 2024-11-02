import { RLPInput } from "./types";
import { concatBytes, encodeLength, encodeBytes, hexToBytes } from "./utils";

/**
 * Encodes an input value to RLP format
 * 
 * @param input - The input value to encode
 * @returns A Uint8Array containing the RLP-encoded value
 */
export const rlpEncode = (input: RLPInput): Uint8Array => {
    if (typeof input === "string") {
        return encodeBytes(hexToBytes(input));
    } else if (input instanceof Uint8Array) {
        return encodeBytes(input);
    } else if (Array.isArray(input)) {
        const encodedItems = input.map(item => rlpEncode(item));
        const totalLength = encodedItems.reduce((sum, item) => sum + item.length, 0);
        return concatBytes(encodeLength(totalLength, 0xc0), ...encodedItems);
    } else {
        throw new Error("Unsupported RLP input type");
    }
}