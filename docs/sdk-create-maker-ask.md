# **How to create a maker ask order**

The main steps are:

1. Initialize a SDK class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via API
> 

```tsx
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdkUser = new GUNftMarketplaceSdk(SupportedChainId.GUSANDBOX, SupportedNetworkId.GUSANDBOX, ethers.provider, signers.user1, mocks.addresses);

const { maker, isCollectionApproved, isTransferManagerApproved } = await sdkUser.createMakerAsk({
	collection: mocks.contracts.collectionERC721.address,
	price: utils.parseEther("1"),
	tokenId: 0,
	strategy: mocks.contracts.strategyStandardSaleForFixedPrice.address,
	nonce: 0,
	endTime: Math.floor(Date.now() / 1000) + 3600,
	minPercentageToAsk: 0,
});

// Approve the collection items to be transferred by the TransferManager
if (!isCollectionApproved) {
  const tx = await sdkUser.approveAllCollectionItems(maker.collection);
  await tx.wait();
}

// Sign your maker order
const signature = await sdkUser.signMakerOrder(maker);
```