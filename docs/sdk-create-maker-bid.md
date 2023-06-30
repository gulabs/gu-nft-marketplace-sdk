# **How to create a maker bid order**

The main steps are:

1. Initialize a SDK class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
2. Use the `createMakerAsk` method to create a maker ask with the parameters of your order.
3. Check and grant necessary approvals for transferring assets.
4. Sign the maker ask order with `signMakerOrder` method.

> The `orderNonce` has to be retrieved via API
> 

```tsx
import { ethers } from "ethers";
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdk = new GUNftMarketplaceSdk(SupportedChainId.HARDHAT, SupportedNetworkId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);

const { maker, isCurrencyApproved } = await sdk.createMakerBid({
	collection: mocks.contracts.collectionERC721.address,
	price: utils.parseEther("1"),
	tokenId: 0,
	strategy: mocks.contracts.strategyStandardSaleForFixedPrice.address,
	nonce: 0,
	endTime: Math.floor(Date.now() / 1000) + 3600,
	minPercentageToAsk: 0,
});

// Approve spending of the currency used for bidding
if (!isCurrencyApproved) {
  const tx = await sdk.approveErc20(sdk.addresses.WETH);
  await tx.wait();
}

// Sign your maker order
const signature = await sdk.signMakerOrder(maker);
```