import { BigNumber, CallOverrides, Contract, providers } from "ethers";
import IExecutionStrategyAbi from "../../abis/IExecutionStrategy.json";
import RoyaltyFeeManagerAbi from "../../abis/RoyaltyFeeManager.json";

import { Signer } from "../../types";

export const calculatorProtocolFee = (
  signerOrProvider: providers.Provider | Signer,
  executionStrategy: string,
  overrides?: CallOverrides
): Promise<BigNumber> => {
  const contract = new Contract(executionStrategy, IExecutionStrategyAbi, signerOrProvider);
  return contract.viewProtocolFee({ ...overrides });
};

export const calculateRoyaltyFeeAndGetRecipient = (
  signerOrProvider: providers.Provider | Signer,
  royaltyFeeManager: string,
  collection: string,
  tokenId: string,
  amount: number,
  overrides?: CallOverrides
): Promise<{
  royaltyFeeRecipient: string,
  royaltyFeeAmount: BigNumber
}> => {
  const contract = new Contract(royaltyFeeManager, RoyaltyFeeManagerAbi, signerOrProvider);
  return contract.calculateRoyaltyFeeAndGetRecipient(collection, tokenId, amount, { ...overrides });
};
