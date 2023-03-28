import { Bingo } from '../Bingo';
import { BingoOutcome } from '../BingoOutcome';
import { bingoConfig } from '../config';
import {
  multiCardOutcomeTestDatasets,
  outcomeTestDatasets,
  parseInputTestDatasets,
  validateInputTestDatasets
} from './bingo.test-data';

beforeAll(() => {
  bingoConfig.bingoCardDimensions = 5;
});

describe('Bingo input validation tests', () => {
  describe.each(validateInputTestDatasets)(
    'Bingo.validateInput($bingoInput)',
    ({ bingoInput, expectedInputIsValid, label }) => {
      test(`Scenario: ${label}`, () => {
        expect(Bingo.validateInput(bingoInput)).toEqual(expectedInputIsValid);
      });
    }
  );
});

describe('Bingo input parsing tests', () => {
  describe.each(parseInputTestDatasets)(
    'Bingo.parseInput($bingoInput)',
    ({ bingoInput, label, expectedBingoCalls, expectedBingoCards }) => {
      test(`Scenario: ${label}`, () => {
        const bingo: Bingo = Bingo.parseInput(bingoInput);
        expect(bingo.getBingoCalls()).toEqual(expectedBingoCalls);
        expectedBingoCards.forEach((expectedCard: number[][], cardIndex: number) => {
          expect(bingo.getBingoCard(cardIndex + 1).bingoNumbers).toEqual(expectedCard);
        });
      });
    }
  );
});

describe('Bingo single card outcome tests', () => {
  describe.each(outcomeTestDatasets)(
    'Bingo.evaluate()',
    ({ label, bingoInput, expectedWin, expectedBingoCallCount }) => {
      test(`Scenario: ${label}`, () => {
        const bingo: Bingo = Bingo.parseInput(bingoInput);
        const bingoOutcome: BingoOutcome = bingo.evaluate();
        expect(bingoOutcome.getCardWinStatus(1)).toEqual(expectedWin);
        expect(bingoOutcome.totalNumbersCalled).toEqual(expectedBingoCallCount);
      });
    }
  );
});

describe('Bingo multi card outcome tests', () => {
  describe.each(multiCardOutcomeTestDatasets)(
    'Bingo.evaluate()',
    ({ label, bingoInput, expectedWinningCards: expectedWinners, expectedBingoCallCount }) => {
      test(`Scenario: ${label}`, () => {
        const bingo: Bingo = Bingo.parseInput(bingoInput);
        const bingoOutcome: BingoOutcome = bingo.evaluate();
        expect(bingoOutcome.winningCards).toEqual(expectedWinners);
        expect(bingoOutcome.totalNumbersCalled).toEqual(expectedBingoCallCount);
      });
    }
  );
});
