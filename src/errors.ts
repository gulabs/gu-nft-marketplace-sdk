
/** Undefined signer */
export class ErrorSigner extends Error {
  public readonly name = "ErrorSigner";
  constructor() {
    super("Signer is undefined");
  }
}


/** Invalid timestamp format */
export class ErrorTimestamp extends Error {
  public readonly name = "ErrorTimestamp";
  constructor() {
    super("Timestamps should be in seconds");
  }
}