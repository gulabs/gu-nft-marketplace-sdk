# **How to cancel orders**

## **Cancel orders using order nonces**

This method is used to invalidate the `orderNonce`. If multiple maker orders share the same nonce, they will all be canceled and non-executable. An `orderNonce` is also invalidated once an order with that nonce is executed.

```tsx
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdkUser = new GUNftMarketplaceSdk(SupportedChainId.GUSANDBOX, SupportedNetworkId.GUSANDBOX, ethers.provider, signers.user1, mocks.addresses);
// Cancel order nonce 0
tx = await sdkUser.cancelMultipleMakerOrders([0]).call();
await tx.wait()

// Cancel order nonce 0 and 12
tx = await sdkUser.cancelMultipleMakerOrders([0, 12]).call();
await tx.wait()
```

## **Cancel all your bids and/or all your asks**

This function can be used to cancel all the sender's bids or all the sender's asks, or both in a single call. The following example showcases all the possible combinations.

```tsx
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdkUser = new GUNftMarketplaceSdk(SupportedChainId.GUSANDBOX, SupportedNetworkId.GUSANDBOX, ethers.provider, signers.user1, mocks.addresses);
// Cancel all orders nonce lower than 12
tx = await sdkUser.cancelAllOrdersForSender(12).call();
await tx.wait()
```