# **How to create a Taker order and execute a trade**

Trades are executed on-chain by matching a `Maker` order with a `Taker` order. The maker order can be retrieved from the API. While the taker order can be obtained by calling the `createTaker` method as shown here:

```tsx
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdkUser = new GUNftMarketplaceSdk(SupportedChainId.GUSANDBOX, SupportedNetworkId.GUSANDBOX, ethers.provider, signers.user1, mocks.addresses);
// The recipient address is optional, if you don't provide it will use your signer address
const takerOrder = sdkUser.createTaker(makerOrder, recipientAddress);
```

From the API response, you will also get the `signature`, which is necessary to execute the trade on-chain. To execute the trade, you can call the `executeOrder` method passing the `Maker`, `Taker` and the `signature`. The method will return a contract call. Here is an example:

```tsx
const { call } = sdkUser.executeOrder(makerOrder, takerOrder, signature);
const sdkUser = await call();
const receipt = await sdkUser.wait();
```