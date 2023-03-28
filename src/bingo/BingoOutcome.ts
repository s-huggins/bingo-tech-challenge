export class BingoOutcome {
  constructor(public readonly winningCards: number[], public readonly totalNumbersCalled: number) {}

  public get haveWinners(): boolean {
    return this.winningCards.length > 0;
  }

  public getCardWinStatus(cardNumber: number): boolean {
    return this.winningCards.some((winningCardNumber: number) => winningCardNumber === cardNumber);
  }
}
