import { TypedDataSigner, TypedDataDomain } from "@ethersproject/abstract-signer";
import { makerTypes } from "../constants/eip712";
import { encodeOrderParams } from "../sign";
import { MakerOrder } from "../types";

/**
 * Sign a maker order
 * @param signer Ethers typed data signer
 * @param domain Typed data domain
 * @param makerOrder Maker order
 * @returns Signature
 */
export const signMakerOrder = async (
  signer: TypedDataSigner,
  domain: TypedDataDomain,
  makerOrder: MakerOrder
): Promise<string> => {
  const { encodedParams } = encodeOrderParams(makerOrder.params);
  
  return signer._signTypedData(domain, makerTypes, {...makerOrder, params: encodedParams });
};