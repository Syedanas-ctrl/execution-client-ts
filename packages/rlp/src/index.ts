import { rlpDecode } from "./decoder";
import { rlpEncode } from "./encoder";
import { bytesToHex, concatBytes, hexToBytes, utf8ToBytes } from "./utils";

export * from "./types";
export const utils = {
    bytesToHex,
    concatBytes,
    hexToBytes,
    utf8ToBytes,
}
export const RLP = {
    encode: rlpEncode,
    decode: rlpDecode,
}