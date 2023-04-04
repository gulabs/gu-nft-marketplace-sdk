import { BigNumber, CallOverrides, Contract, Overrides, providers } from "ethers";
import { ERC721Abi } from "../../abis/ts/ERC721";
import { ERC20Abi } from "../../abis/ts/ERC20";

import { Signer } from "../../types";

export const isApprovedForAll = (
  signerOrProvider: providers.Provider | Signer,
  collection: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
): Promise<boolean> => {
  const contract = new Contract(collection, ERC721Abi, signerOrProvider);
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

export const allowance = (
  signerOrProvider: providers.Provider | Signer,
  currency: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
): Promise<BigNumber> => {
  const contract = new Contract(currency, ERC20Abi, signerOrProvider);
  return contract.allowance(account, operator, { ...overrides });
};

export const setApprovalForAll = (
  signer: Signer,
  collection: string,
  operator: string,
  approved: boolean,
  overrides?: Overrides
) => {
  const contract = new Contract(collection, ERC721Abi, signer);
  return contract.setApprovalForAll(operator, approved, { ...overrides });
};

export const approve = (
  signer: Signer,
  currency: string,
  operator: string,
  amount: BigNumber,
  overrides?: Overrides
) => {
  const contract = new Contract(currency, ERC20Abi, signer);
  return contract.approve(operator, amount, { ...overrides });
};
