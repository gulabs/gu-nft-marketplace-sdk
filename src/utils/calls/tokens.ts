import { BigNumber, CallOverrides, Contract, Overrides, providers } from "ethers";
import IERC721 from "../../abis/IERC721.json";
import IERC20 from "../../abis/IERC20.json";

import { Signer } from "../../types";

export const isApprovedForAll = (
  signerOrProvider: providers.Provider | Signer,
  collection: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
): Promise<boolean> => {
  const contract = new Contract(collection, IERC721, signerOrProvider);
  return contract.isApprovedForAll(account, operator, { ...overrides });
};

export const allowance = (
  signerOrProvider: providers.Provider | Signer,
  currency: string,
  account: string,
  operator: string,
  overrides?: CallOverrides
): Promise<BigNumber> => {
  const contract = new Contract(currency, IERC20, signerOrProvider);
  return contract.allowance(account, operator, { ...overrides });
};

export const setApprovalForAll = (
  signer: Signer,
  collection: string,
  operator: string,
  approved: boolean,
  overrides?: Overrides
) => {
  const contract = new Contract(collection, IERC721, signer);
  return contract.setApprovalForAll(operator, approved, { ...overrides });
};

export const approve = (
  signer: Signer,
  currency: string,
  operator: string,
  amount: BigNumber,
  overrides?: Overrides
) => {
  const contract = new Contract(currency, IERC20, signer);
  return contract.approve(operator, amount, { ...overrides });
};
