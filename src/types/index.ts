import { BigNumber, ContractTransaction, ethers, Overrides } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";

export type SolidityType = "bool" | "address" | "uint256" | "bytes" | "bytes32" | "bytes32[]";

export { SupportedChainId, OrderValidatorEnum, OrderValidatorStatus } from "./enum";
export type { ChainInfo, Addresses } from "./constants";
export type {
  MakerOrder,
  MakerOrderWithEncodedParams,
  MakerOrderWithSignature,
  MakerOrderWithVRS,
  TakerOrder,
  TakerOrderWithEncodedParams,
} from "./orders";

/**
 * Temporary type until full of TypedDataSigner in ethers V6
 * @see https://github.com/ethers-io/ethers.js/blob/master/packages/abstract-signer/src.ts/index.ts#L53
 */
export type Signer = ethers.Signer & TypedDataSigner;

/** Return type for any on chain call */
export interface ContractMethods {
  call: (additionalOverrides?: Overrides) => Promise<ContractTransaction>;
  estimateGas: (additionalOverrides?: Overrides) => Promise<BigNumber>;
  callStatic: (additionalOverrides?: Overrides) => Promise<any>;
}