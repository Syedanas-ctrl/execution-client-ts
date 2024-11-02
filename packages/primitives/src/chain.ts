import { B64, BlockTimestamp, N256, N32, N64 } from "./bytes";
import { Hardfork } from "./hardfork";

export enum Chain {
    Mainnet = 1,
    Goerli = 5,
    Sepolia = 11155111,
    Holesky = 17000,
    Kaustinen6 = 69420,
}

export interface ChainConfig {
    name: string;
    chainId: Chain;
    defaultHardfork: Hardfork;
    genesis: GenesisBlockConfig;
    // TODO: Add other chain params
}

interface GenesisBlockConfig {
    timestamp: BlockTimestamp;
    gasLimit: N64;
    difficulty: N256;
    nonce: B64;
    extraData: N32;
    baseFeePerGas: N64;
    excessBlobGas: N64;
}