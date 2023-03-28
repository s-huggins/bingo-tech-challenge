import { Bingo } from './bingo/Bingo';
import { BingoOutcome } from './bingo/BingoOutcome';
import InvalidBingoInputError from './bingo/errors/InvalidBingoInputError';
import { pluralize } from './lib/pluralize';

export function main() {
  const input: string = process.argv[2];
  const bingo: Bingo = Bingo.parseInput(input);
  const outcome: BingoOutcome = bingo.evaluate();
  if (outcome.haveWinners) {
    const singleWinner: boolean = outcome.winningCards.length === 1;
    const winningCards: string = outcome.winningCards.join(', ');
    const message: string = singleWinner
      ? `The winning card is ${winningCards}!`
      : `The winning cards are ${winningCards}!`;
    console.log(
      `Bingo! ${message} Game will last for ${outcome.totalNumbersCalled} ${pluralize(
        outcome.totalNumbersCalled,
        'call',
        'calls'
      )}.`
    );
  } else {
    console.log('No winners!');
  }
}

try {
  main();
} catch (err) {
  if (InvalidBingoInputError.isInvalidBingoInputError(err)) {
    console.log(err.message);
  } else {
    // unknown error
    throw err;
  }
}
