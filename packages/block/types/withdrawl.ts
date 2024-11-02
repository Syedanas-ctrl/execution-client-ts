import { Address } from "../../primitives/src/address";
import { N64 } from "../../primitives/src/bytes";


export interface Withdrawal {
    index: N64;
    validatorIndex: N64
    address: Address
    amount: N64
}