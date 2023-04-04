import { TypedDataField } from "@ethersproject/abstract-signer";

export type EIP712TypedData = Record<string, Array<TypedDataField>>;

export const makerTypes: EIP712TypedData = {
  MakerOrder: [
    { name: "isOrderAsk", type: "bool" },
    { name: "signer", type: "address" },
    { name: "collection", type: "address" },
    { name: "price", type: "uint256" },
    { name: "tokenId", type: "uint256" },
    { name: "amount", type: "uint256" },
    { name: "strategy", type: "address" },
    { name: "currency", type: "address" },
    { name: "nonce", type: "uint256" },
    { name: "startTime", type: "uint256" },
    { name: "endTime", type: "uint256" },
    { name: "minPercentageToAsk", type: "uint256" },
    { name: "params", type: "bytes" },
  ],
};