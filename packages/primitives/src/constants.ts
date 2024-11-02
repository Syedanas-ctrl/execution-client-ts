import { hexToBytes } from "../../rlp/src/utils"

//we are using bytes array as internal representation

/**
 * Keccak-256 hash of null
 */
export const KECCAK256_NULL_S = '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
export const KECCAK256_NULL = hexToBytes(KECCAK256_NULL_S)

/**
 * Keccak-256 of an RLP of an empty array
 */
export const KECCAK256_RLP_ARRAY_S = '0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347'
export const KECCAK256_RLP_ARRAY = hexToBytes(KECCAK256_RLP_ARRAY_S)

/**
 * Keccak-256 of an RLP of null
 */
export const KECCAK256_RLP_S = '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
export const KECCAK256_RLP = hexToBytes(KECCAK256_RLP_S)

/**
 * BigInt constants
 */

export const BIGINT_NEG1 = BigInt(-1)

export const BIGINT_0 = BigInt(0)
export const BIGINT_1 = BigInt(1)
export const BIGINT_2 = BigInt(2)
export const BIGINT_3 = BigInt(3)
export const BIGINT_7 = BigInt(7)
export const BIGINT_8 = BigInt(8)

export const BIGINT_27 = BigInt(27)
export const BIGINT_28 = BigInt(28)
export const BIGINT_31 = BigInt(31)
export const BIGINT_32 = BigInt(32)
export const BIGINT_64 = BigInt(64)

export const BIGINT_128 = BigInt(128)
export const BIGINT_255 = BigInt(255)
export const BIGINT_256 = BigInt(256)

export const BIGINT_96 = BigInt(96)
export const BIGINT_100 = BigInt(100)
export const BIGINT_160 = BigInt(160)
export const BIGINT_224 = BigInt(224)
export const BIGINT_2EXP96 = BigInt(79228162514264337593543950336)
export const BIGINT_2EXP160 = BigInt(1461501637330902918203684832716283019655932542976)
export const BIGINT_2EXP224 =
  BigInt(26959946667150639794667015087019630673637144422540572481103610249216)
export const BIGINT_2EXP256 = BIGINT_2 ** BIGINT_256