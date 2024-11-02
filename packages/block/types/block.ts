import { BlockBody } from "./block-body";
import { Header } from "./header"

export interface Block {
    header: Header;
    body: BlockBody;
}