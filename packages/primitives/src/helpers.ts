import { hexToBytes } from "../../rlp/src/utils"
import { PrefixedHexString } from "./types"

export function isHexString(value: string, length?: number): value is PrefixedHexString {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) return false

  if (typeof length !== 'undefined' && length > 0 && value.length !== 2 + 2 * length) return false

  return true
}

export function padToEven(value: string): string {
  let a = value

  if (typeof a !== 'string') {
    throw new Error(`[padToEven] value must be type 'string', received ${typeof a}`)
  }

  if (a.length % 2) a = `0${a}`

  return a
}