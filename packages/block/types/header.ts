import { Address } from "../../primitives/src/address";
import { B160, B256, B64, BlockNumber, BlockTimestamp, N256, N64, PrefixedHexString } from "../../primitives/src/types";
import { BIGINT_0, KECCAK256_RLP, KECCAK256_RLP_ARRAY } from "../../primitives/src/constants";

export interface Header {
    parentHash: B256;
    ommersHash: B256;
    beneficiary: Address;
    stateRoot: B256;
    transactionsRoot: B256;
    logsBloom: B256;
    difficulty: N256;
    number: BlockNumber;
    gasLimit: N64;
    gasUsed: N64;
    timeStamp: BlockTimestamp;
    mixHash: B256;
    nonce: B64;
}

export interface HeaderJSON {
    parentHash: PrefixedHexString;
    ommersHash: PrefixedHexString;
    beneficiary: PrefixedHexString;
    stateRoot: PrefixedHexString;
    transactionsRoot: PrefixedHexString;
    logsBloom: PrefixedHexString;
    difficulty: PrefixedHexString;
    number: PrefixedHexString;
    gasLimit: PrefixedHexString;
    gasUsed: PrefixedHexString;
    timeStamp: PrefixedHexString;
    mixHash: PrefixedHexString;
    nonce: PrefixedHexString;
}

export const HEADER_DEFAULTS = {
    parentHash: new B256(),
    ommersHash: KECCAK256_RLP_ARRAY,
    beneficiary: new Address(new B160()),
    stateRoot: new B256(),
    transactionsRoot: KECCAK256_RLP,
    logsBloom: new B256(),
    difficulty: BIGINT_0,
    number: BIGINT_0,
    gasLimit: BigInt('0xffffffffffffff'),
    gasUsed: BIGINT_0,
    timeStamp: BIGINT_0,
    mixHash: new B256(),
    nonce: new B64(),
}
