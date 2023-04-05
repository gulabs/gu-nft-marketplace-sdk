import { Contract, ethers, Overrides, providers } from "ethers";
import { OrderValidatorV1 } from "../../typechain";
import { Signer, OrderValidatorEnum, MakerOrder } from "../../types";
import { OrderValidatorV1Abi } from "../../abis/ts/OrderValidatorV1";

export const verifyMakerOrder = async (
  signerOrProvider: providers.Provider | Signer,
  orderValidator: string,
  makerOrder: MakerOrder,
  makerSignature: string,
  overrides?: Overrides
): Promise<OrderValidatorEnum[]> => {
  const contract = new Contract(orderValidator, OrderValidatorV1Abi, signerOrProvider) as OrderValidatorV1;
  const { v, r, s } = ethers.utils.splitSignature(makerSignature);
  
  const makerAskAndSignature = { ...makerOrder, r, v, s };

  const codes = await contract.checkOrderValidity(makerAskAndSignature, {
    ...overrides,
  });
  return codes.map((code) => code.toNumber() as OrderValidatorEnum);
};

export const verifyMakerOrders = async (
  signerOrProvider: providers.Provider | Signer,
  orderValidator: string,
  makerOrders: MakerOrder[],
  signatures: string[],
  overrides?: Overrides
): Promise<OrderValidatorEnum[][]> => {
  const contract = new Contract(orderValidator, OrderValidatorV1Abi, signerOrProvider) as OrderValidatorV1;
  const makerAskAndSignatures = makerOrders.map((makerOrder, i) => {
    const { v, r, s } = ethers.utils.splitSignature(signatures[i]);
    return { ...makerOrder, r, v, s }
  })

  const orders = await contract.checkMultipleOrderValidities(makerAskAndSignatures, {
    ...overrides,
  });
  return orders.map((order) => order.map((code) => code.toNumber() as OrderValidatorEnum));
};
