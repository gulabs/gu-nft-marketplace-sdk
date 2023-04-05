import {  ethers, PayableOverrides } from "ethers";
import { ContractMethods, MakerOrder, MakerOrderWithVRS, Signer, TakerOrder } from "../../types";
import LooksRareExchangeAbi from "../../abis/LooksRareExchange.json";

export const matchAskWithTakerBidUsingETHAndWETH = (
  signer: Signer,
  exchange: string,
  takerBid: TakerOrder,
  makerAsk: MakerOrder,
  makerSignature: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const contract = new ethers.Contract(exchange, LooksRareExchangeAbi, signer);
  const { v, r, s } = ethers.utils.splitSignature(makerSignature);
  
  const makerAskAndSignature: MakerOrderWithVRS = { ...makerAsk, r, v, s };

  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.matchAskWithTakerBidUsingETHAndWETH(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.matchAskWithTakerBidUsingETHAndWETH(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.matchAskWithTakerBidUsingETHAndWETH(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
}

export const matchAskWithTakerBid = (
  signer: Signer,
  exchange: string,
  takerBid: TakerOrder,
  makerAsk: MakerOrder,
  makerSignature: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const contract = new ethers.Contract(exchange, LooksRareExchangeAbi, signer);
  const { v, r, s } = ethers.utils.splitSignature(makerSignature);
  
  const makerAskAndSignature: MakerOrderWithVRS = { ...makerAsk, r, v, s };

  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.matchAskWithTakerBid(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.matchAskWithTakerBid(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.matchAskWithTakerBid(takerBid, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
}

export const matchBidWithTakerAsk = (
  signer: Signer,
  exchange: string,
  takerAsk: TakerOrder,
  makerBid: MakerOrder,
  makerSignature: string,
  overrides?: PayableOverrides
): ContractMethods => {
  const contract = new ethers.Contract(exchange, LooksRareExchangeAbi, signer);
  const { v, r, s } = ethers.utils.splitSignature(makerSignature);
  
  const makerAskAndSignature: MakerOrderWithVRS = { ...makerBid, r, v, s };

  return {
    call: (additionalOverrides?: PayableOverrides) =>
      contract.matchBidWithTakerAsk(takerAsk, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    estimateGas: (additionalOverrides?: PayableOverrides) =>
      contract.estimateGas.matchBidWithTakerAsk(takerAsk, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
    callStatic: (additionalOverrides?: PayableOverrides) =>
      contract.callStatic.matchBidWithTakerAsk(takerAsk, makerAskAndSignature, {
        ...overrides,
        ...additionalOverrides,
      }),
  };
}