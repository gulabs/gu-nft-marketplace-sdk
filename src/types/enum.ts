export enum SupportedChainId {
  MAINNET = 1,
  GOERLI = 5,
  HARDHAT = 31337,
  GU_SANDBOX = 99999
}

/**
 * https://github.com/LooksRare/contracts-exchange-v1/blob/master/contracts/orderValidation/ValidationCodeConstants.sol
 */
export enum OrderValidatorEnum {
  ORDER_EXPECTED_TO_BE_VALID = 0,
  NONCE_EXECUTED_OR_CANCELLED = 101,
  NONCE_BELOW_MIN_ORDER_NONCE = 102,
  ORDER_AMOUNT_CANNOT_BE_ZERO = 201,
  MAKER_SIGNER_IS_NULL_SIGNER = 301,
  INVALID_S_PARAMETER_EOA = 302,
  INVALID_V_PARAMETER_EOA = 303,
  NULL_SIGNER_EOA = 304,
  WRONG_SIGNER_EOA = 305,
  SIGNATURE_INVALID_EIP1271 = 311,
  MISSING_IS_VALID_SIGNATURE_FUNCTION_EIP1271 = 312,
  CURRENCY_NOT_WHITELISTED = 401,
  STRATEGY_NOT_WHITELISTED = 402,
  MIN_NET_RATIO_ABOVE_PROTOCOL_FEE = 501,
  MIN_NET_RATIO_ABOVE_ROYALTY_FEE_REGISTRY_AND_PROTOCOL_FEE = 502,
  MIN_NET_RATIO_ABOVE_ROYALTY_FEE_ERC2981_AND_PROTOCOL_FEE = 503,
  MISSING_ROYALTY_INFO_FUNCTION_ERC2981 = 504,
  TOO_EARLY_TO_EXECUTE_ORDER = 601,
  TOO_LATE_TO_EXECUTE_ORDER = 602,
  NO_TRANSFER_MANAGER_AVAILABLE_FOR_COLLECTION = 701,
  CUSTOM_TRANSFER_MANAGER = 702,
  ERC20_BALANCE_INFERIOR_TO_PRICE = 711,
  ERC20_APPROVAL_INFERIOR_TO_PRICE = 712,
  ERC721_TOKEN_ID_DOES_NOT_EXIST = 721,
  ERC721_TOKEN_ID_NOT_IN_BALANCE = 722,
  ERC721_NO_APPROVAL_FOR_ALL_OR_TOKEN_ID = 723,
  ERC1155_BALANCE_OF_DOES_NOT_EXIST = 731,
  ERC1155_BALANCE_OF_TOKEN_ID_INFERIOR_TO_AMOUNT = 732,
  ERC1155_IS_APPROVED_FOR_ALL_DOES_NOT_EXIST = 733,
  ERC1155_NO_APPROVAL_FOR_ALL = 734,
}

export type OrderValidatorStatus = keyof typeof OrderValidatorEnum;
