import { BigNumber, BigNumberish, constants, ContractTransaction, ethers, Overrides, PayableOverrides, providers } from "ethers";
import { addressesByNetwork, contractName, version } from "./constants";
import { Addresses, ContractMethods, MakerOrder, OrderValidatorEnum, Signer, SupportedChainId } from "./types";
import * as multicall from "@0xsequence/multicall";
import { ErrorSigner, ErrorTimestamp } from "./errors";
import { TypedDataDomain } from "@ethersproject/abstract-signer";
import { CreateMakerAskOutput, CreateMakerBidOutput, CreateMakerCollectionOfferInput, CreateMakerInput, CreateTakerInput, TakerOrder } from "./types/orders";
import { allowance, approve, isApprovedForAll, setApprovalForAll } from "./utils/calls/tokens";
import { signMakerOrder } from "./utils/signMakerOrder";
import { matchAskWithTakerBid, matchAskWithTakerBidUsingETHAndWETH, matchBidWithTakerAsk } from "./utils/calls/exchange";
import { cancelAllOrdersForSender, cancelMultipleMakerOrders } from "./utils/calls/cancel";
import { verifyMakerOrder, verifyMakerOrders } from "./utils/calls/validator";
import { encodeOrderParams } from "./utils/encodeOrderParams";

/**
 * LooksRare
 * This class provides helpers to interact with the LooksRare V1 contracts
 */
export class LooksRare {
  /** Current app chain ID */
  public readonly chainId: SupportedChainId;
  /** Mapping of LooksRare protocol addresses for the current chain */
  public readonly addresses: Addresses;

  /**
  * Ethers signer
  * @see https://docs.ethers.io/v5/api/signer/
  */
  public readonly signer?: Signer;

  /**
  * Ethers multicall provider
  * @see https://docs.ethers.io/v5/api/providers/
  * @see https://github.com/0xsequence/sequence.js/tree/master/packages/multicall
  */
  public readonly provider: providers.Provider;

  /**
  * LooksRare protocol main class
  * @param chainId Current app chain id
  * @param provider Ethers provider
  * @param signer Ethers signer
  * @param override Overrides contract addresses for hardhat setup
  */
  constructor(chainId: SupportedChainId, provider: providers.Provider, signer?: Signer, override?: Addresses) {
    this.chainId = chainId;
    this.addresses = override ?? addressesByNetwork[this.chainId];
    this.signer = signer;
    this.provider = new multicall.providers.MulticallProvider(provider);
  }
  
  /**
 * Return the signer it it's set, throw an exception otherwise
 * @returns Signer
 */
  private getSigner(): Signer {
    if (!this.signer) {
      throw new ErrorSigner();
    }
    return this.signer;
  }
  
  /**
   * Validate a timestamp format (seconds)
   * @param timestamp
   * @returns boolean
   */
  private isTimestampValid(timestamp: BigNumberish): boolean {
    return BigNumber.from(timestamp).toString().length <= 10;
  }
  
  /**
   * Retrieve EIP-712 domain
   * @returns TypedDataDomain
   */
  public getTypedDataDomain(): TypedDataDomain {
    return {
      name: contractName,
      version: version.toString(),
      chainId: this.chainId,
      verifyingContract: this.addresses.EXCHANGE,
    };
  }
/**
 * Create a maker ask object ready to be signed
 * @param CreateMakerInput
 * @returns the maker object, isTransferManagerApproved, and isTransferManagerApproved
 */
  public async createMakerAsk({
    collection,
    price,
    tokenId,
    amount = 1,
    strategy = this.addresses.STRATEGY_STANDARD_SALE_DEPRECATED,
    currency = this.addresses.WETH,
    nonce,
    startTime = Math.floor(Date.now() / 1000),
    endTime,
    minPercentageToAsk = 0,
    params=[]
  }: CreateMakerInput): Promise<CreateMakerAskOutput> {
    const signer = this.getSigner();

    if (!this.isTimestampValid(startTime) || !this.isTimestampValid(endTime)) {
      throw new ErrorTimestamp();
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_ERC721;

    const isCollectionApproved = await isApprovedForAll(this.provider, collection, signerAddress, spenderAddress);

    const order: MakerOrder = {
      isOrderAsk: true,
      signer: signerAddress,
      collection,
      price,
      tokenId,
      amount,
      strategy,
      currency,
      nonce,
      startTime,
      endTime,
      minPercentageToAsk,
      params: encodeOrderParams(params).encodedParams,
    };

    return {
      maker: order,
      isCollectionApproved,
    };
  }

  /**
   * Create a maker bid object ready to be signed
   * @param CreateMakerInput
   * @returns the maker object and isCurrencyApproved
   */
  public async createMakerBid({
    collection,
    price,
    tokenId,
    amount = 1,
    strategy = this.addresses.STRATEGY_STANDARD_SALE_DEPRECATED,
    currency = this.addresses.WETH,
    nonce,
    startTime = Math.floor(Date.now() / 1000),
    endTime,
    minPercentageToAsk = 0,
    params=[]
  }: CreateMakerInput): Promise<CreateMakerBidOutput> {
    const signer = this.getSigner();

    if (!this.isTimestampValid(startTime) || !this.isTimestampValid(endTime)) {
      throw new ErrorTimestamp();
    }

    const signerAddress = await signer.getAddress();
    const spenderAddress = this.addresses.EXCHANGE;

    const currentAllowance = await allowance(this.provider, currency, signerAddress, spenderAddress)

    const order: MakerOrder = {
      isOrderAsk: false,
      signer: signerAddress,
      collection,
      price,
      tokenId,
      amount,
      strategy,
      currency,
      nonce,
      startTime,
      endTime,
      minPercentageToAsk,
      params: encodeOrderParams(params).encodedParams,
    };

    return {
      maker: order,
      isCurrencyApproved: BigNumber.from(currentAllowance).gte(price),
    };
  }

  public createMakerCollectionOffer(orderInputs: CreateMakerCollectionOfferInput): Promise<CreateMakerBidOutput> {
    return this.createMakerBid({
      ...orderInputs,
      strategy: orderInputs.strategy || this.addresses.STRATEGY_COLLECTION_SALE_DEPRECATED,
      tokenId: constants.Zero
    });
  }

  public createTaker(maker: MakerOrder, takerInput: CreateTakerInput): TakerOrder {
    const order: TakerOrder = {
      isOrderAsk: !maker.isOrderAsk,
      taker: takerInput.taker,
      price: maker.price,
      tokenId: maker.tokenId,
      minPercentageToAsk: takerInput.minPercentageToAsk || 0,
      params: encodeOrderParams(takerInput.params).encodedParams
    };
    return order;
  }
  
  /**
   * Sign a maker order using the signer provided in the constructor
   * @param maker Order to be signed by the user
   * @returns Signature
   */
  public async signMakerOrder(maker: MakerOrder): Promise<string> {
    const signer = this.getSigner();

    return signMakerOrder(signer, this.getTypedDataDomain(), maker);
  }

  /**
   * Execute a trade
   * @returns ContractMethods
   */
  public executeOrder(
    maker: MakerOrder,
    taker: TakerOrder,
    signature: string,
    overrides?: PayableOverrides
  ): ContractMethods {
    const signer = this.getSigner();
    let execute;
    if (maker.isOrderAsk && maker.currency === this.addresses.WETH) {
      execute = matchAskWithTakerBidUsingETHAndWETH
    } else if (maker.isOrderAsk && maker.currency !== this.addresses.WETH) {
      execute = matchAskWithTakerBid
    } else {
      execute = matchBidWithTakerAsk
    }
    
    return execute(signer, this.addresses.EXCHANGE, taker, maker, signature, overrides);
  }

  /**
   * Cancell all maker bid and/or ask orders for the current user
   * @returns ContractMethods
   */
  public cancelAllOrdersForSender(minNonce: BigNumberish, overrides?: Overrides): ContractMethods {
    const signer = this.getSigner();

    return cancelAllOrdersForSender(signer, this.addresses.EXCHANGE, minNonce, overrides);
  } 

  /**
   * Cancel a list of specific orders
   * @param nonces List of nonces to be cancelled
   * @returns ContractMethods
   */
  public cancelMultipleMakerOrders(nonces: BigNumberish[], overrides?: Overrides): ContractMethods {
    const signer = this.getSigner();
    return cancelMultipleMakerOrders(signer, this.addresses.EXCHANGE, nonces, overrides);
  }

  /**
   * Approve all the items of a collection, to eventually be traded on LooksRare
   * The spender is the TransferManager.
   * @param collectionAddress Address of the collection to be approved.
   * @param approved true to approve, false to revoke the approval (default to true)
   * @returns ContractTransaction
   */
  public approveAllCollectionItems(
    collectionAddress: string,
    approved = true,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.TRANSFER_MANAGER_ERC721;
    return setApprovalForAll(signer, collectionAddress, spenderAddress, approved, overrides);
  }  

  /**
   * Approve an ERC20 to be used as a currency on LooksRare.
   * The spender is the LooksRareProtocol contract.
   * @param tokenAddress Address of the ERC20 to approve
   * @param amount Amount to be approved (default to MaxUint256)
   * @returns ContractTransaction
   */
  public approveErc20(
    tokenAddress: string,
    amount: BigNumber = ethers.constants.MaxUint256,
    overrides?: Overrides
  ): Promise<ContractTransaction> {
    const signer = this.getSigner();
    const spenderAddress = this.addresses.EXCHANGE;
    return approve(signer, tokenAddress, spenderAddress, amount, overrides);
  }

  public async verifyMakerOrder(
    makerOrder: MakerOrder,
    makerSignature: string,
    overrides?: Overrides
  ): Promise<OrderValidatorEnum[]> {
    return verifyMakerOrder(
      this.provider,
      this.addresses.ORDER_VALIDATOR_V1,
      makerOrder,
      makerSignature,
      overrides
    );
  }

  public async verifyMakerOrders(
    makerOrders: MakerOrder[],
    signatures: string[],
    overrides?: Overrides
  ): Promise<OrderValidatorEnum[][]> {
    return verifyMakerOrders(
      this.provider,
      this.addresses.ORDER_VALIDATOR_V1,
      makerOrders,
      signatures,
      overrides
    );
  }
  
}
