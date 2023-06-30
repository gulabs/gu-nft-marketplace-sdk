# **Verify order validity**

The LooksRare SDK also provides a method to validate your order. It can be used as follows:

```tsx
import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";

const sdkUser = new GUNftMarketplaceSdk(SupportedChainId.GUSANDBOX, SupportedNetworkId.GUSANDBOX, ethers.provider, signers.user1, mocks.addresses);

const validatorCodes = await lr.verifyMakerOrders([makerOrder], [signature]);
```

To see all the possible validation codes, see the `OrderValidatorCode` enum located in [src/types.ts](https://github.com/gulabs/gu-nft-marketplace-contracts/blob/master/contracts/orderValidation/ValidationCodeConstants.sol).