import { Header } from "./header";
import { Transaction } from "./transaction";
import { Withdrawal } from "./withdrawl";

export interface BlockBody {
    transactions: Transaction[];
    ommers: Header[];
    withdrawals: Withdrawal[];
}
