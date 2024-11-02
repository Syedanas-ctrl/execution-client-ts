import { bytesToHex } from "../../rlp/src/utils";
import { B160, PrefixedHexString } from "./types";
import { keccak256 } from 'ethereum-cryptography/keccak.js'


// Examplar address -> 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
export class Address {
    private readonly bytes: B160;

    constructor(input: string | B160) {
        if (typeof input === 'string')
            this.bytes = Address.fromString(input);
        else if (input instanceof Uint8Array && input.length === 20)
            this.bytes = input;
        else 
            throw new Error('Invalid address input')
    }

    private static fromString(hex: string):B160 {
        if (hex.startsWith('0x'))
            hex = hex.slice(2)
        if (hex.length !== 40)
            throw new Error('Invalid address length')
        const bytes = new Uint8Array(20);
        for (let i = 0; i < 20; i++) {
            bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
        }
        return bytes as B160;
    }

    public toBytes(): B160 {
        return this.bytes;
    }

    //The padding with '0' in the toString() method is used to ensure that each byte is represented by exactly two hexadecimal characters.
    public toString(): PrefixedHexString {
        return bytesToHex(this.bytes, true) as PrefixedHexString;
    }

    public toChecksumAddress(): string {
        const hex = this.toString().slice(2).toLowerCase();
        const hash = keccak256(Buffer.from(hex, 'hex'));
        let result = '0x';

        for (let i = 0; i < 40; i++) {
            result += parseInt(hash[i >> 1].toString(16), 16) >> (i % 2 ? 0 : 4) >= 8 
                ? hex[i].toUpperCase() 
                : hex[i];
        }

        return result;
    }

    public isAddress(value: unknown): boolean {
        return value instanceof Address
    }

    public zero(): Address{
        return new Address('0x' + '0'.repeat(40));
    }

    public same(other: Address): boolean {
        return this.toString() === other.toString()
    }
}