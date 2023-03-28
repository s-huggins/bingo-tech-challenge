import { chunk } from '../lib/chunk';
import { hasDuplicates } from '../lib/hasDuplicates';
import { splitLines } from '../lib/splitLines';
import { BingoCard } from './BingoCard';
import { BingoOutcome } from './BingoOutcome';
import { bingoConfig } from './config';
import InvalidBingoInputError from './errors/InvalidBingoInputError';

/**
 * Parses valid Bingo input and evaluates which Bingo cards win the game.
 */
export class Bingo {
  /** Regex for comma-separated values */
  public static readonly BINGO_CARD_DIMENSION: number = bingoConfig.bingoCardDimensions;
  private static readonly BINGO_CALLS_REGEX: RegExp = /^\d+(,\d+)*$/;
  /** Regex for exactly n space-separated values, where n is the dimension of the Bingo card */
  private static get BINGO_CARD_ROW_REGEX(): RegExp {
    return new RegExp('^\\d+( \\d+){' + (bingoConfig.bingoCardDimensions - 1) + '}$');
  }

  public static parseInput(input: string): Bingo {
    const inputIsValid: boolean = this.validateInput(input);
    if (!inputIsValid) {
      throw new InvalidBingoInputError();
    }
    const [bingoCallsInput, ...bingoCardRowsInput]: string[] = splitLines(input);
    const bingoCalls: number[] = this.parseBingoCallsInput(bingoCallsInput);
    const bingoCards: BingoCard[] = this.parseBingoCardRowsInput(bingoCardRowsInput);
    return new Bingo(bingoCalls, bingoCards);
  }

  public static validateInput(input: string): boolean {
    let inputIsValid: boolean = false;
    if (input) {
      const [bingoCallsInput, ...bingoCardRowsInput]: string[] = splitLines(input);
      inputIsValid = this.validateBingoCallsInput(bingoCallsInput) && this.validateBingoCardsInput(bingoCardRowsInput);
    }
    return inputIsValid;
  }

  private static validateBingoCallsInput(bingoCallsInput: string): boolean {
    let callsInputValid: boolean = this.BINGO_CALLS_REGEX.test(bingoCallsInput);
    if (callsInputValid) {
      const bingoCalls: number[] = this.parseBingoCallsInput(bingoCallsInput);
      const inputContainsDuplicatedBingoCall: boolean = hasDuplicates(bingoCalls);
      callsInputValid = !inputContainsDuplicatedBingoCall;
    }
    return callsInputValid;
  }

  private static validateBingoCardsInput(bingoCardRowsInput: string[]): boolean {
    let bingoCardsInputValid: boolean =
      bingoCardRowsInput.length > 0 &&
      bingoCardRowsInput.length % this.BINGO_CARD_DIMENSION === 0 &&
      bingoCardRowsInput.every((cardRow: string) => this.BINGO_CARD_ROW_REGEX.test(cardRow));

    if (bingoCardsInputValid) {
      const bingoCards: BingoCard[] = this.parseBingoCardRowsInput(bingoCardRowsInput);
      for (const card of bingoCards) {
        const cardNumbers: number[] = card.bingoNumbers.flat();
        const cardContainsDuplicatedValue: boolean = hasDuplicates(cardNumbers);
        if (cardContainsDuplicatedValue) {
          bingoCardsInputValid = false;
          break;
        }
      }
    }

    return bingoCardsInputValid;
  }

  private static parseBingoCallsInput(bingoCallsInput: string): number[] {
    return bingoCallsInput.split(',').map((bingoCall: string) => parseInt(bingoCall, 10));
  }

  private static parseBingoCardRowsInput(bingoCardRowsInput: string[]): BingoCard[] {
    const bingoCardRows: number[][] = bingoCardRowsInput.map((bingoCardRow: string) =>
      bingoCardRow.split(' ').map((bingoCardValue: string) => parseInt(bingoCardValue, 10))
    );
    const chunkedBingoCardRows: number[][][] = chunk(bingoCardRows, bingoConfig.bingoCardDimensions);
    const bingoCards = chunkedBingoCardRows.map(
      (bingoCardRows: number[][], index: number) => new BingoCard(index + 1, bingoCardRows)
    );
    return bingoCards;
  }

  private _evaluated: boolean = false;
  /** How many values have been called out */
  private _totalNumbersCalled: number = 0;
  private _winningCardNumbers: number[] = [];

  constructor(private readonly _bingoCalls: number[], private readonly _bingoCards: BingoCard[]) {}

  public getBingoCalls(): number[] {
    return [...this._bingoCalls];
  }

  public getBingoCard(cardNumber: number): BingoCard {
    return this._bingoCards[cardNumber - 1].clone();
  }

  private get haveBingo(): boolean {
    return this._winningCardNumbers.length > 0;
  }

  /**
   * Evaluates the outcome of the Bingo game
   */
  public evaluate(): BingoOutcome {
    if (!this._evaluated) {
      for (const calledValue of this._bingoCalls) {
        this._totalNumbersCalled++;
        for (let bingoCard of this._bingoCards) {
          const bingo: boolean = bingoCard.call(calledValue);
          if (bingo) {
            this._winningCardNumbers.push(bingoCard.cardNumber);
          }
        }
        if (this.haveBingo) {
          break;
        }
      }
      this._evaluated = true;
    }

    return new BingoOutcome([...this._winningCardNumbers], this._totalNumbersCalled);
  }
}
