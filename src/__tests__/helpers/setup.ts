/* eslint-disable no-await-in-loop */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractTransaction } from "ethers";
import { ethers } from "hardhat";
import type { WETH } from "../../typechain/solmate/src/tokens/WETH";
import type { GUNftMarketplaceExchange } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/GUNftMarketplaceExchange";
import type { CurrencyManager } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/CurrencyManager"; 
import type { ExecutionManager } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/ExecutionManager";
import type { StrategyStandardSaleForFixedPrice } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/executionStrategies/StrategyStandardSaleForFixedPrice";
import type { RoyaltyFeeManager } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/RoyaltyFeeManager";
import type { RoyaltyFeeRegistry } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/royaltyFeeHelpers/RoyaltyFeeRegistry";
import type { RoyaltyFeeSetter } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/royaltyFeeHelpers/RoyaltyFeeSetter";
import type { TransferManagerERC721 } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/transferManagers/TransferManagerERC721";
import type { TransferManagerERC1155 } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/transferManagers/TransferManagerERC1155";
import type { TransferSelectorNFT } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/TransferSelectorNFT";
import type { OrderValidatorV1 } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/orderValidation/OrderValidatorV1";
import type { StrategyAnyItemFromCollectionForFixedPrice } from "../../typechain/@gulabs/gu-nft-marketplace-contracts/contracts/executionStrategies/StrategyAnyItemFromCollectionForFixedPrice";
import type { MockERC721 } from "../../typechain/src/contracts/mocks/MockERC721";
import type { MockERC20 } from "../../typechain/src/contracts/mocks/MockERC20";
import { Addresses } from "../../types";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

export interface SetupMocks {
  contracts: {
    weth: WETH;
    usdt: MockERC20;
    currencyManager: CurrencyManager;
    strategyStandardSaleForFixedPrice: StrategyStandardSaleForFixedPrice;
    strategyAnyItemFromCollectionForFixedPrice: StrategyAnyItemFromCollectionForFixedPrice
    royaltyFeeManager: RoyaltyFeeManager;
    royaltyFeeRegistry: RoyaltyFeeRegistry;
    royaltyFeeSetter: RoyaltyFeeSetter;
    exchange: GUNftMarketplaceExchange;
    transferManagerERC721: TransferManagerERC721;
    transferManagerERC1155: TransferManagerERC1155;
    transferSelectorNFT: TransferSelectorNFT
    orderValidatorV1: OrderValidatorV1;
    collectionERC721: MockERC721;
  },
  addresses: Addresses;
}

export interface Signers {
  owner: SignerWithAddress;
  operator: SignerWithAddress;
  protocolFeeRecipient: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
  user3: SignerWithAddress;
}

export const NB_NFT_PER_USER = 3;

const deploy = async (name: string, ...args: any[]): Promise<Contract> => {
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy(...args);
  await contract.deployed();
  return contract;
};

export const getSigners = async (): Promise<Signers> => {
  const signers = await ethers.getSigners();
  return {
    owner: signers[0],
    operator: signers[1],
    protocolFeeRecipient: signers[2],
    user1: signers[3],
    user2: signers[4],
    user3: signers[5],
  };
};

export const setUpContracts = async (): Promise<SetupMocks> => {
  const signers = await getSigners();
  let tx: ContractTransaction;

  // deploy currency manager, weth, usdt
  const weth = (await deploy("WETH")) as WETH;
  const usdt = (await deploy("MockERC20", "Tether USD", "USDT")) as MockERC20;
  
  const currencyManager = (await deploy("CurrencyManager")) as CurrencyManager;
  tx = await currencyManager.addCurrency(weth.address);
  tx.wait()
  tx = await currencyManager.addCurrency(usdt.address);
  tx.wait()

  // deploy strategy manager
  const strategyStandardSaleForFixedPrice = (await deploy("StrategyStandardSaleForFixedPrice", 200)) as StrategyStandardSaleForFixedPrice;
  const strategyAnyItemFromCollectionForFixedPrice = (await deploy("StrategyAnyItemFromCollectionForFixedPrice", 200)) as StrategyAnyItemFromCollectionForFixedPrice;

  const executionManager = (await deploy("ExecutionManager")) as ExecutionManager;
  tx = await executionManager.addStrategy(strategyStandardSaleForFixedPrice.address);
  await tx.wait()
  tx = await executionManager.addStrategy(strategyAnyItemFromCollectionForFixedPrice.address);
  await tx.wait()
  
  // deploy royalty fee manager
  const royaltyFeeRegistry = (await deploy("RoyaltyFeeRegistry", 200)) as RoyaltyFeeRegistry;
  const royaltyFeeSetter = (await deploy("RoyaltyFeeSetter", royaltyFeeRegistry.address)) as RoyaltyFeeSetter;
  const royaltyFeeManager = (await deploy("RoyaltyFeeManager", royaltyFeeRegistry.address)) as RoyaltyFeeManager;
  tx = await royaltyFeeRegistry.transferOwnership(royaltyFeeSetter.address);
  await tx.wait()

  // deploy exchange
  const exchange = (await deploy(
    "GUNftMarketplaceExchange",
    currencyManager.address,
    executionManager.address,
    royaltyFeeManager.address,
    weth.address,
    signers.protocolFeeRecipient.address
  )) as GUNftMarketplaceExchange;

  // deploy transfer selector
  const transferManagerERC721 = (await deploy("TransferManagerERC721", exchange.address)) as TransferManagerERC721;
  const transferManagerERC1155 = (await deploy("TransferManagerERC1155", exchange.address)) as TransferManagerERC1155;
  const transferSelectorNFT = (await deploy("TransferSelectorNFT", transferManagerERC721.address, transferManagerERC1155.address)) as TransferSelectorNFT;

  tx = await exchange.updateTransferSelectorNFT(transferSelectorNFT.address);
  await tx.wait()

  // deploy order validator
  const orderValidatorV1 = (await deploy("OrderValidatorV1", exchange.address)) as OrderValidatorV1;
  const collectionERC721 = (await deploy("MockERC721", "collectionERC721", "COL1")) as MockERC721;

  // setup balances
  const wethUser1 = new ethers.Contract(weth.address, weth.interface, signers.user1);
  tx = await wethUser1.deposit({ value: ethers.utils.parseEther("10") });
  await tx.wait();

  const wethUser2 = new ethers.Contract(weth.address, weth.interface, signers.user2);
  tx = await wethUser2.deposit({ value: ethers.utils.parseEther("10") });
  await tx.wait();

  const usdtUser1 = new ethers.Contract(usdt.address, usdt.interface, signers.user1);
  tx = await usdtUser1.mint(signers.user1.address, ethers.utils.parseEther("10"));
  await tx.wait();

  const usdtUser2 = new ethers.Contract(usdt.address, usdt.interface, signers.user2);
  tx = await usdtUser2.mint(signers.user2.address, ethers.utils.parseEther("10"));
  await tx.wait();

  for (let i = 0; i < NB_NFT_PER_USER; i++) {
    tx = await collectionERC721.mint(signers.user1.address);
    await tx.wait();  
  }

  return {
    contracts: {
      weth,
      usdt,
      currencyManager,
      strategyStandardSaleForFixedPrice,
      strategyAnyItemFromCollectionForFixedPrice,
      royaltyFeeManager,
      royaltyFeeRegistry,
      royaltyFeeSetter,
      exchange,
      transferManagerERC721,
      transferManagerERC1155,
      transferSelectorNFT,
      orderValidatorV1,
      collectionERC721,
    },
    addresses: {
      WETH: weth.address,
      ROYALTY_FEE_MANAGER: royaltyFeeManager.address,
      ROYALTY_FEE_REGISTRY: royaltyFeeRegistry.address,
      ROYALTY_FEE_SETTER: royaltyFeeSetter.address,
      EXCHANGE: exchange.address,
      TRANSFER_MANAGER_ERC721: transferManagerERC721.address,
      TRANSFER_MANAGER_ERC1155: transferManagerERC1155.address,
      TRANSFER_SELECTOR_NFT: transferSelectorNFT.address,
      STRATEGY_STANDARD_SALE_DEPRECATED: strategyStandardSaleForFixedPrice.address,
      STRATEGY_COLLECTION_SALE_DEPRECATED: strategyAnyItemFromCollectionForFixedPrice.address,
      STRATEGY_STANDARD_SALE: "",
      STRATEGY_COLLECTION_SALE: "",
      STRATEGY_PRIVATE_SALE: "",
      STRATEGY_DUTCH_AUCTION: "",
      EXECUTION_MANAGER: executionManager.address,
      CURRENCY_MANAGER: currencyManager.address,
      ORDER_VALIDATOR_V1: orderValidatorV1.address,
    }
  }
}