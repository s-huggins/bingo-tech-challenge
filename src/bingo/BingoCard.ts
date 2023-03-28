import { ICell } from '../lib/interfaces/ICell';
import { IClonable } from '../lib/interfaces/IClonable';
import { IDictionary } from '../lib/interfaces/IDictionary';
import { bingoConfig } from './config';

export class BingoCard implements IClonable<BingoCard> {
  /**
   * Creates a mapping from the bingo card value to its row and column indices on the card for constant-time position lookup
   */
  private static createBingoValuePositionLookupMap(bingoNumbers: number[][]): IDictionary<ICell> {
    const bingoValuePositionMapByBingoValue: IDictionary<ICell> = {};
    for (let rowIndex = 0; rowIndex < bingoConfig.bingoCardDimensions; rowIndex++) {
      for (let colIndex = 0; colIndex < bingoConfig.bingoCardDimensions; colIndex++) {
        const bingoValue: number = bingoNumbers[rowIndex][colIndex];
        const bingoPosition: ICell = { rowIndex, colIndex };
        bingoValuePositionMapByBingoValue[bingoValue] = bingoPosition;
      }
    }
    return bingoValuePositionMapByBingoValue;
  }

  /** Lookup from a bingo value to its row/col indices on the card */
  private _bingoCardValuePositionMapByBingoValue: IDictionary<ICell>;
  /** Lookup from row index to the count of values called out along that row */
  private _rowBingoValuesCalledCountMapByRowIndex: IDictionary<number> = {};
  /** Lookup from column index to the count of values called out along that column */
  private _columnBingoValuesCalledCountMapByColumnIndex: IDictionary<number> = {};
  private _haveBingo: boolean = false;

  constructor(public readonly cardNumber: number, public readonly bingoNumbers: number[][]) {}

  public call(calledValue: number): boolean {
    if (this.valueIsOnCard(calledValue)) {
      const position: ICell = this.getValuePosition(calledValue);
      this.incrementCountOfValuesCalledForCardRow(position.rowIndex);
      this.incrementCountOfValuesCalledForCardColumn(position.colIndex);

      const haveCompleteRow: boolean =
        this.getCountOfValuesCalledForCardRow(position.rowIndex) === bingoConfig.bingoCardDimensions;
      const haveCompleteColumn: boolean =
        this.getCountOfValuesCalledForCardColumn(position.colIndex) === bingoConfig.bingoCardDimensions;

      this._haveBingo = haveCompleteRow || haveCompleteColumn;
    }
    return this._haveBingo;
  }

  public getValuePosition(value: number): ICell {
    if (!this._bingoCardValuePositionMapByBingoValue) {
      this._bingoCardValuePositionMapByBingoValue = BingoCard.createBingoValuePositionLookupMap(this.bingoNumbers);
    }
    return this._bingoCardValuePositionMapByBingoValue[value];
  }

  public valueIsOnCard(value: number): boolean {
    return !!this.getValuePosition(value);
  }

  public clone(): BingoCard {
    const bingoNumbersClone: number[][] = this.bingoNumbers.map((row: number[]) => [...row]);
    return new BingoCard(this.cardNumber, bingoNumbersClone);
  }

  private getCountOfValuesCalledForCardRow(rowIndex: number): number {
    return this._rowBingoValuesCalledCountMapByRowIndex[rowIndex] ?? 0;
  }

  private getCountOfValuesCalledForCardColumn(columnIndex: number): number {
    return this._columnBingoValuesCalledCountMapByColumnIndex[columnIndex] ?? 0;
  }

  private incrementCountOfValuesCalledForCardRow(rowIndex: number): void {
    this._rowBingoValuesCalledCountMapByRowIndex[rowIndex] ??= 0;
    this._rowBingoValuesCalledCountMapByRowIndex[rowIndex]++;
  }

  private incrementCountOfValuesCalledForCardColumn(columnIndex: number): void {
    this._columnBingoValuesCalledCountMapByColumnIndex[columnIndex] ??= 0;
    this._columnBingoValuesCalledCountMapByColumnIndex[columnIndex]++;
  }
}
