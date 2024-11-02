import { hexToBytes } from "../../rlp/src/utils"
import { BIGINT_0 } from "./constants"
import { isHexString, padToEven } from "./helpers"
import { B128, B16, B160, B256, B32, B64, PrefixedHexString, ToBytesInputTypes } from "./types"
import {
    bytesToHex as _bytesToUnprefixedHex,
    hexToBytes as nobleH2B,
  } from 'ethereum-cryptography/utils.js'

/**
* Converts a {@link number} into a {@link PrefixedHexString}
* @param {number} i
* @return {PrefixedHexString}
*/
export const intToHex = (i: number | bigint): PrefixedHexString => {
    if (!Number.isSafeInteger(i) || i < 0) {
        throw new Error(`Received an invalid integer type: ${i}`)
    }
    return ('0x' + i.toString(16)) as PrefixedHexString
}

/**
 * Converts an {@link number} to a {@link Uint8Array}
 * @param {Number} i
 * @return {Uint8Array}
 */
export const intToBytes = (i: number): Uint8Array => {
    const hex = intToHex(i)
    return hexToBytes(hex)
}

export const bigIntToUnpaddedBytes = (value: bigint): Uint8Array => {
    return stripZeros(bigIntToBytes(value))
  }

/**
 * Converts a {@link bigint} to a {@link Uint8Array}
 *  * @param {bigint} num the bigint to convert
 * @returns {Uint8Array}
 */
export const bigIntToBytes = (num: bigint, littleEndian = false): Uint8Array => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const bytes = toBytes(`0x${padToEven(num.toString(16))}`)

    return littleEndian ? bytes.reverse() : bytes
}

export const unprefixedHexToBytes = (hex: string) => {
    if (hex.startsWith('0x')) throw new Error('input string cannot be 0x prefixed')
    return nobleH2B(padToEven(hex))
  }

export function toBytes(input: ToBytesInputTypes): Uint8Array {
    if (input === null || input === undefined) {
        return new Uint8Array()
    }

    if (Array.isArray(input) || input instanceof Uint8Array) {
        return Uint8Array.from(input)
    }

    if (typeof input === 'string') {
        if (!isHexString(input)) {
            throw new Error(
                `Cannot convert string to Uint8Array. toBytes only supports 0x-prefixed hex strings and this string was given: ${input}`,
            )
        }
        return hexToBytes(input)
    }

    if (typeof input === 'number') {
        return intToBytes(input)
    }

    if (typeof input === 'bigint') {
        if (input < BIGINT_0) {
            throw new Error(`Cannot convert negative bigint to Uint8Array. Given: ${input}`)
        }
        let n = input.toString(16)
        if (n.length % 2) n = '0' + n
        return unprefixedHexToBytes(n)
    }

    // if (input.toBytes !== undefined) {
    //     // converts a `TransformableToBytes` object to a Uint8Array
    //     return input.toBytes()
    // }

    throw new Error('invalid type')
}

const stripZeros = <T extends Uint8Array | number[] | string = Uint8Array | number[] | string>(
    a: T,
  ): T => {
    let first = a[0]
    while (a.length > 0 && first.toString() === '0') {
      a = a.slice(1) as T
      first = a[0]
    }
    return a
  }
  