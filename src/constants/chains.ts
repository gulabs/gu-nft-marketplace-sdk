import { ChainInfo, SupportedNetworkId } from "../types";

export const GU_SANDBOX_DEV_BASE_API_URL = ""
export const GU_SANDBOX_TEST_BASE_API_URL = "https://test.api.nft-marketplace.gu.net"
export const HARDHAT_BASE_API_URL = ""

export const CHAIN_INFO: { [chainId in SupportedNetworkId]: ChainInfo } = {
  [SupportedNetworkId.GU_SANDBOX_DEV]: {
    label: "G.U.Sandbox Dev",
    appUrl: "",
    explorer: "https://sandbox1.japanopenchain.org",
    rpcUrl: "https://sandbox1.japanopenchain.org:8545",
    baseApiUrl: GU_SANDBOX_DEV_BASE_API_URL,
    apiUrl: `${GU_SANDBOX_DEV_BASE_API_URL}/graphql`,
  },
  [SupportedNetworkId.GU_SANDBOX_TEST]: {
    label: "G.U.Sandbox Test",
    appUrl: "https://test.nft-marketplace.gu.net",
    explorer: "https://sandbox1.japanopenchain.org",
    rpcUrl: "https://sandbox1.japanopenchain.org:8545",
    baseApiUrl: GU_SANDBOX_TEST_BASE_API_URL,
    apiUrl: `${GU_SANDBOX_TEST_BASE_API_URL}/graphql`,
  },
  [SupportedNetworkId.HARDHAT]: {
    label: "Hardhat",
    appUrl: "http://localhost:3000",
    explorer: "https://etherscan.io",
    rpcUrl: "http://127.0.0.1:8545",
    baseApiUrl: HARDHAT_BASE_API_URL,
    apiUrl: `${HARDHAT_BASE_API_URL}/graphql`,
  },
};

export const isSupportedChain = (chainId: string): chainId is SupportedNetworkId => {
  return Object.values(SupportedNetworkId).includes(chainId);
};
