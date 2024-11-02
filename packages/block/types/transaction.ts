import { Address } from "../../primitives/src/address";
import { B256, B64, N256, ChainId, N32, N128, N64 } from "../../primitives/src/bytes";


interface AccessListEntry {
    address: Address;
    storageKeys: B256[];
}


interface BaseTransaction {
    nonce: B64;
    to: Address;
    value: N256;
    chainId: ChainId;
    data: N32;
}

/**
 * @deprecated
 */
interface LegacyTransaction extends BaseTransaction {
    type?: '0x0' | undefined;
    gasPrice: N128;
    gasLimit: N64;
    v: B256;
    r: B256;
    s: B256;
}

/**
 * @deprecated
 */
interface EIP2930Transaction extends BaseTransaction {
    type: '0x1';
    gasPrice: N128;
    gasLimit: N64;
    accessList: AccessListEntry[];
    v: B256;
    r: B256;
    s: B256;
}

/**
 * @deprecated
 */
interface EIP1559Transaction extends BaseTransaction {
    type: '0x2';
    maxPriorityFeePerGas: N128;
    maxFeePerGas: N128;
    gasLimit: N64;
    accessList: AccessListEntry[];
    v: B256;
    r: B256;
    s: B256;
}

interface EIP4844Transaction extends BaseTransaction {
    type: '0x3';
    maxPriorityFeePerGas: N128;
    maxFeePerGas: N128;
    gasLimit: N64;
    maxFeePerBlobGas: N128;
    blobVersionedHashes: B256[];
    accessList: AccessListEntry[];
    v: B256;
    r: B256;
    s: B256;
}

// Lets just use one for simplicity
export type Transaction = EIP4844Transaction;