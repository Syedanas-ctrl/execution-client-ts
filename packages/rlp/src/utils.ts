import { PrefixedHexString } from "../../primitives/src/types";
import { NestedUint8Array } from "./types";

/**
 * Converts a hexadecimal string to a Uint8Array of bytes
 * 
 * @param hexString - The input hex string (can optionally include '0x' prefix)
 * @returns Uint8Array containing the byte representation of the hex string
 * @throws Error if the hex string is invalid
 */
export const hexToBytes = (hexString: string): Uint8Array => {
    const cleanHexString = hexString.startsWith('0x')
        ? hexString.slice(2)
        : hexString;

    if (cleanHexString.length % 2 !== 0) {
        throw new Error('Invalid hex string: length must be even');
    }

    if (!/^[0-9A-Fa-f]+$/.test(cleanHexString)) {
        throw new Error('Invalid hex string: contains non-hexadecimal characters');
    }

    const bytes = new Uint8Array(cleanHexString.length / 2);

    for (let i = 0; i < cleanHexString.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHexString.substr(i, 2), 16);
    }

    return bytes;
}

/**
* Converts a Uint8Array of bytes to a hexadecimal string
* 
* @param bytes - The input byte array
* @param prefix - Whether to include '0x' prefix in the output (default: false)
* @returns Hexadecimal string representation of the bytes
*/
export const bytesToHex = (bytes: Uint8Array, prefix: boolean = false): string | PrefixedHexString => {
    const hex = Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');

    return prefix ? `0x${hex}` : hex;
}


/**
 * Concatenates multiple Uint8Array objects into a single Uint8Array
 * 
 * @param arrays - The input byte arrays to concatenate
 * @returns A new Uint8Array containing the concatenated bytes
 */
export const concatBytes = (...arrays: Uint8Array[]): Uint8Array => {
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (let i=0; i< arrays.length; i++) {
        result.set(arrays[i], offset);
        offset += arrays[i].length;
    }
    return result;
}

/**
 * Encodes the length of an RLP-encoded value
 * 
 * @param len - The length of the value to encode
 * @param offset - The offset to use for the encoded length
 * @returns A Uint8Array containing the encoded length
 */
export const encodeLength = (len: number, offset: number): Uint8Array => {
    if (len < 56) {
        return new Uint8Array([len + offset]);
    } else {
        const hexLen = len.toString(16);
        const lenBytes = hexToBytes(hexLen);
        return concatBytes(new Uint8Array([lenBytes.length + offset + 55]), lenBytes);
    }
}

/**
 * Encodes a Uint8Array as an RLP-encoded value
 * 
 * @param input - The input byte array to encode
 * @returns A Uint8Array containing the RLP-encoded value
 */
export const encodeBytes = (input: Uint8Array): Uint8Array => {
    if (input.length === 1 && input[0] < 0x80) {
        return input;
    } else {
        return concatBytes(encodeLength(input.length, 0x80), input);
    }
}


/**
 * Converts a Uint8Array to an integer
 * 
 * @param bytes - The input byte array
 * @returns The integer value represented by the bytes
 */
const bytesToInt = (bytes: Uint8Array): number => {
    return parseInt(bytesToHex(bytes).slice(2), 16);
}

/**
 * Decodes an RLP encoded Uint8Array
 * 
 * @param input - The input Uint8Array to decode
 * @param start - The starting index to decode from
 * @returns The decoded data and the remainder of the input
 */
export const decodeItem = (input: Uint8Array, start: number): [Uint8Array | NestedUint8Array, number] => {
    const prefix = input[start];
    
    if (prefix <= 0x7f) {
        // Single byte, value is itself
        return [input.slice(start, start + 1), start + 1];
    } else if (prefix <= 0xb7) {
        // Short string
        const length = prefix - 0x80;
        return [input.slice(start + 1, start + 1 + length), start + 1 + length];
    } else if (prefix <= 0xbf) {
        // Long string
        const lengthOfLength = prefix - 0xb7;
        const length = bytesToInt(input.slice(start + 1, start + 1 + lengthOfLength));
        return [input.slice(start + 1 + lengthOfLength, start + 1 + lengthOfLength + length), start + 1 + lengthOfLength + length];
    } else if (prefix <= 0xf7) {
        // Short list
        const length = prefix - 0xc0;
        return decodeList(input, start + 1, length);
    } else {
        // Long list
        const lengthOfLength = prefix - 0xf7;
        const length = bytesToInt(input.slice(start + 1, start + 1 + lengthOfLength));
        return decodeList(input, start + 1 + lengthOfLength, length);
    }
}

/**
 * Decodes an RLP encoded Uint8Array
 * 
 * @param input - The input Uint8Array to decode
 * @param start - The starting index to decode from
 * @param length - The length of the list to decode
 * @returns The decoded data and the remainder of the input
 */
const decodeList = (input: Uint8Array, start: number, length: number): [NestedUint8Array, number] => {
    const end = start + length;
    const items: NestedUint8Array = [];
    let offset = start;
    
    while (offset < end) {
        const [item, newOffset] = decodeItem(input, offset);
        items.push(item);
        offset = newOffset;
    }
    
    return [items, end];
}


declare const TextEncoder: any
/**
 * Converts a UTF-8 string to a Uint8Array
 * 
 * @param utf - The input string to convert
 * @returns A Uint8Array containing the UTF-8 encoded bytes
 */
export const utf8ToBytes = (utf: string): Uint8Array => {
  return new TextEncoder().encode(utf)
}