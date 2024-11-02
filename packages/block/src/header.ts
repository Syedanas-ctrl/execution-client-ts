import { Address } from "../../primitives/src/address";
import { bigIntToUnpaddedBytes, intToHex } from "../../primitives/src/bytes";
import { BIGINT_0 } from "../../primitives/src/constants";
import { B256, B64, BlockNumber, BlockTimestamp, N256, N32, N64, PrefixedHexString } from "../../primitives/src/types";
import { RLP } from "../../rlp/src";
import { bytesToHex } from "../../rlp/src/utils";
import { Header, HEADER_DEFAULTS, HeaderJSON } from "../types/header";
import { keccak256 } from 'ethereum-cryptography/keccak.js'

export class BlockHeader {
    public readonly parentHash: B256;
    public readonly ommersHash: B256;
    public readonly beneficiary: Address;
    public readonly stateRoot: B256;
    public readonly transactionsRoot: B256;
    public readonly receiptsRoot: B256;
    public readonly withdrawalsRoot: B256;
    public readonly requestsRoot: B256;

    public readonly logsBloom: B256;

    public readonly difficulty: N256;
    public readonly number: BlockNumber;
    public readonly gasLimit: N64;
    public readonly gasUsed: N64;
    public readonly timeStamp: BlockTimestamp;

    public readonly mixHash: B256;
    public readonly nonce: B64;

    public readonly baseFeePerGas: N64;
    public readonly excessBlobGas: N64;
    public readonly parentBeaconBlockRoot: N64;

    public readonly extraData: N32;

    protected keccakFunction: (msg: Uint8Array) => B256
    protected cache: { hash: B256 | undefined } = {
        hash: undefined,
    }

    constructor(headerData: Header) {
        const parentHash = headerData.parentHash instanceof B256 ? headerData.parentHash : HEADER_DEFAULTS.parentHash;
        const ommersHash = headerData.ommersHash instanceof B256 ? headerData.ommersHash : HEADER_DEFAULTS.ommersHash;
        const beneficiary = headerData.beneficiary instanceof Address ? headerData.beneficiary : HEADER_DEFAULTS.beneficiary;
        const stateRoot = headerData.stateRoot instanceof B256 ? headerData.stateRoot : HEADER_DEFAULTS.stateRoot;
        const transactionsRoot = headerData.transactionsRoot instanceof B256 ? headerData.transactionsRoot : HEADER_DEFAULTS.transactionsRoot;
        const logsBloom = headerData.logsBloom instanceof B256 ? headerData.logsBloom : HEADER_DEFAULTS.logsBloom;

        const difficulty = typeof headerData.difficulty === 'bigint' ? headerData.difficulty : HEADER_DEFAULTS.difficulty;
        const number = typeof headerData.number === 'bigint' ? headerData.number : HEADER_DEFAULTS.number;
        const gasLimit = typeof headerData.gasLimit === 'bigint' ? headerData.gasLimit : HEADER_DEFAULTS.gasLimit;
        const gasUsed = typeof headerData.gasUsed === 'bigint' ? headerData.gasUsed : HEADER_DEFAULTS.gasUsed;
        const timeStamp = typeof headerData.timeStamp === 'bigint' ? headerData.timeStamp : HEADER_DEFAULTS.timeStamp;

        const mixHash = headerData.mixHash instanceof B256 ? headerData.mixHash : HEADER_DEFAULTS.mixHash;
        const nonce = headerData.nonce instanceof B64 ? headerData.nonce : HEADER_DEFAULTS.nonce;

        this.keccakFunction = keccak256;
        this.parentHash = parentHash;
        this.ommersHash = ommersHash;
        this.beneficiary = beneficiary;
        this.stateRoot = stateRoot;
        this.transactionsRoot = transactionsRoot;
        this.logsBloom = logsBloom;
        this.difficulty = difficulty;
        this.number = number;
        this.gasLimit = gasLimit;
        this.gasUsed = gasUsed;
        this.timeStamp = timeStamp;
        this.mixHash = mixHash;
        this.nonce = nonce;
    }

    //Note: Assuming ETHash consensus
    protected _consensusFormatValidation() {
        const { nonce, ommersHash, difficulty, number } = this;

        // PoW/Ethash
        if (number > BIGINT_0) {
            throw new Error('Invalid block number')
        }
    }

    isGenesis() {
        return this.number === BIGINT_0;
    }

    validateGasLimit(parentBlockHeader: BlockHeader) {
        //TODO: Implement
    }

    raw(): Uint8Array[] {
        return [
            this.parentHash,
            this.ommersHash,
            this.beneficiary.toBytes(),
            this.stateRoot,
            this.transactionsRoot,
            this.logsBloom,
            bigIntToUnpaddedBytes(this.difficulty),
            bigIntToUnpaddedBytes(this.number),
            bigIntToUnpaddedBytes(this.gasLimit),
            bigIntToUnpaddedBytes(this.gasUsed),
            bigIntToUnpaddedBytes(this.timeStamp),
            this.mixHash,
            this.nonce,
        ]
    }

    /**
    * Returns the hash of the block header.
    */
    hash() {
        if (Object.isFrozen(this)) {
            if (!this.cache.hash) {
                this.cache.hash = this.keccakFunction(RLP.encode(this.raw())) as B256
            }
            return this.cache.hash
        }
        return this.keccakFunction(RLP.encode(this.raw())) as B256
    }

    /**
    * Returns the rlp encoding of the block header.
    */
    serialize(): Uint8Array {
        return RLP.encode(this.raw())
    }

    JSON(): HeaderJSON {
        return {
            parentHash: bytesToHex(this.parentHash, true) as PrefixedHexString,
            ommersHash: bytesToHex(this.ommersHash, true) as PrefixedHexString,
            beneficiary: this.beneficiary.toString(),
            stateRoot: bytesToHex(this.stateRoot, true) as PrefixedHexString,
            transactionsRoot: bytesToHex(this.transactionsRoot, true) as PrefixedHexString,
            logsBloom: bytesToHex(this.logsBloom, true) as PrefixedHexString,

            difficulty: intToHex(this.difficulty),
            number: intToHex(this.number),
            gasLimit: intToHex(this.gasLimit),
            gasUsed: intToHex(this.gasUsed),
            timeStamp: intToHex(this.timeStamp),

            mixHash: bytesToHex(this.mixHash, true) as PrefixedHexString,
            nonce: bytesToHex(this.nonce, true) as PrefixedHexString,
        }
    }
}
