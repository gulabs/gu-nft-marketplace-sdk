# **How to create a collection offer (maker bid with collection strategy)**

- The code snippet below is an example of how to create a maker bid using the `@gu-nft-marketplace/sdk` library.
    
    > A collection order is just a maker bid order using the `StrategyAnyItemFromCollectionForFixedPrice`
    > 
- The main steps are:
    1. Initialize a sdk class instance by providing the chain id, [RPC provider](https://docs.ethers.io/v5/api/providers/) and a [signer](https://docs.ethers.io/v5/api/signer/).
    2. Use the createMakerCollectionOffer method to create a maker bid with the parameters of your order.
    3. Check and grant necessary approvals for transferring assets.
    4. Sign the maker bid order with `signMakerOrder` method
    
    > The `orderNonce` has to be retrieved via API
    > 
    
    ```tsx
    import { ethers } from "ethers";
    import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";
    
    const sdk = new GUNftMarketplaceSdk(SupportedChainId.HARDHAT, SupportedNetworkId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    
    const { maker, isCurrencyApproved } = await lr.createMakerCollectionOffer({
      collection: mocks.contracts.collectionERC721.address,
      price: utils.parseEther("1"),
      nonce: 0,
      endTime: Math.floor(Date.now() / 1000) + 3600,
      minPercentageToAsk: 0,
    });
    
    // Approve spending of the currency used for bidding
    if (!isCurrencyApproved) {
      const tx = await lr.approveErc20(lr.addresses.WETH);
      await tx.wait();
    }
    
    // Sign your maker order
    const signature = await sdk.signMakerOrder(maker);
    ```
    
    # **How to execute a collection offer**
    
    `createTakerForCollectionOrder` is just a convenient wrapper around `createTaker`.
    
    ```tsx
    import { GUNftMarketplaceSdk, SupportedChainId, SupportedNetworkId } from "@gu-nft-marketplace/sdk";
    
    const sdk = new GUNftMarketplaceSdk(SupportedChainId.HARDHAT, SupportedNetworkId.HARDHAT, ethers.provider, signers.user1, mocks.addresses);
    
    // To be done only once the first a user is interacting with contracts.
    // It will grant the Exchange contract with the right to use your collections approvals done on the transfer manager.
    await setApprovalForAll(signer, maker.collection, lr.addresses.TRANSFER_MANAGER_V2);
    
    const taker = sdk.createTakerCollectionOffer(maker, 1, { taker: signers.user2.address });
    
    const { call } = sdk.executeOrder(maker, taker, signature);
    const tx = await call();
    const receipt = await tx.wait();
    ```