import { BigNumber, BigNumberish, CallOverrides, Contract, ethers, Overrides, providers } from "ethers";
import { ContractMethods, Signer } from "../../types";
import LooksRareExchangeAbi from "../../abis/LooksRareExchange.json";

export const userMinOrderNonce = (
  signerOrProvider: providers.Provider | Signer,
  exchange: string,
  signerAddress: string,
  overrides?: CallOverrides
): Promise<BigNumber> => {
  const contract = new Contract(exchange, LooksRareExchangeAbi, signerOrProvider);
  return contract.userMinOrderNonce(signerAddress, { ...overrides });
};

export const cancelAllOrdersForSender = (
  signer: Signer,
  exchange: string,
  minNonce: BigNumberish,
  overrides?: Overrides
): ContractMethods => {
  const contract = new ethers.Contract(exchange, LooksRareExchangeAbi, signer);
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.cancelAllOrdersForSender(minNonce, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.cancelAllOrdersForSender(minNonce, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.callStatic.cancelAllOrdersForSender(minNonce, { ...overrides, ...additionalOverrides }),
  };
};

export const cancelMultipleMakerOrders = (
  signer: Signer,
  exchange: string,
  orderNonces: BigNumberish[],
  overrides?: Overrides
): ContractMethods => {
  const contract = new ethers.Contract(exchange, LooksRareExchangeAbi, signer);
  return {
    call: (additionalOverrides?: Overrides) =>
      contract.cancelMultipleMakerOrders(orderNonces, { ...overrides, ...additionalOverrides }),
    estimateGas: (additionalOverrides?: Overrides) =>
      contract.estimateGas.cancelMultipleMakerOrders(orderNonces, { ...overrides, ...additionalOverrides }),
    callStatic: (additionalOverrides?: Overrides) =>
      contract.callStatic.cancelMultipleMakerOrders(orderNonces, { ...overrides, ...additionalOverrides }),
  };
};