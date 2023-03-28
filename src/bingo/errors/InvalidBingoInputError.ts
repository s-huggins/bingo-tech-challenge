export default class InvalidBingoInputError {
  public static isInvalidBingoInputError(error: any): error is InvalidBingoInputError {
    return error instanceof InvalidBingoInputError;
  }

  public readonly message: string = 'Input was invalid!';
}
