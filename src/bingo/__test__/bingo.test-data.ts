import dedent from 'dedent-js';

interface ITestDataset {
  bingoInput: string;
  label: string;
}

interface IValidateBingoInputTestDataset extends ITestDataset {
  expectedInputIsValid: boolean;
}

interface IParseValidBingoInputTestDataset extends ITestDataset {
  expectedBingoCalls: number[];
  expectedBingoCards: number[][][];
}

interface IBingoOutcomeTestDataset extends ITestDataset {
  expectedWin: boolean;
  expectedBingoCallCount: number;
}

interface IMultiBingoOutcomeTestDataset extends ITestDataset {
  expectedWinningCards: number[];
  expectedBingoCallCount: number;
}

/** N.B. dedent removes the leading line break and strips the base indentation from successive lines */
export const validateInputTestDatasets: IValidateBingoInputTestDataset[] = [
  {
    label: 'Valid Bingo input (single card)',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19`,
    expectedInputIsValid: true
  },
  {
    label: 'Valid Bingo input (multiple cards)',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
      3 15 0 2 22
      9 18 13 17 5
      19 8 7 25 23
      20 11 10 24 4
      14 21 16 12 6
      14 21 17 24 4
      10 16 15 9 19
      18 8 23 26 20
      22 11 13 6 5
      2 0 12 3 7`,
    expectedInputIsValid: true
  },
  {
    label: 'Invalid dimensions for Bingo card (last row has only 4 values)',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Invalid dimensions for Bingo card (missing a fifth row)',
    bingoInput: dedent`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
    22 13 17 11 0
    8 2 23 4 24
    21 9 14 16 7
    6 10 3 18 5`,
    expectedInputIsValid: false
  },
  {
    label: 'Invalid dimensions for Bingo card (only have 4 columns)',
    bingoInput: dedent`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Input is missing Bingo calls',
    bingoInput: dedent`
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Input is missing Bingo card',
    bingoInput: dedent`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1`,
    expectedInputIsValid: false
  },
  {
    label: 'Trailing comma on Bingo calls',
    bingoInput: dedent`
    7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1,
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Bingo calls are not comma-separated',
    bingoInput: dedent`
    7 4 9 5 11 17 23 2 0 14 21 24 10 16 13 6 15 25 12 22 18 20 8 19 3 26 1
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Bingo call is duplicated (7)',
    bingoInput: dedent`
    7 4 9 5 7 17 23 2 0 14 21 24 10 16 13 6 15 25 12 22 18 20 8 19 3 26 1
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  },
  {
    label: 'Bingo card value is duplicated (7)',
    bingoInput: dedent`
    7 4 9 5 7 17 23 7 0 14 21 24 10 16 13 6 15 25 12 22 18 20 8 19 3 26 1
    22 13 17 11
    8 2 23 4
    21 9 14 16
    6 10 3 18
    1 12 20 15`,
    expectedInputIsValid: false
  }
];

export const parseInputTestDatasets: IParseValidBingoInputTestDataset[] = [
  {
    label: 'Parse valid Bingo input (single card)',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19`,
    expectedBingoCalls: [
      7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1
    ],
    expectedBingoCards: [
      [
        [22, 13, 17, 11, 0],
        [8, 2, 23, 4, 24],
        [21, 9, 14, 16, 7],
        [6, 10, 3, 18, 5],
        [1, 12, 20, 15, 19]
      ]
    ]
  },
  {
    label: 'Parse valid Bingo input (multiple cards)',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
      3 15 0 2 22
      9 18 13 17 5
      19 8 7 25 23
      20 11 10 24 4
      14 21 16 12 6
    `,
    expectedBingoCalls: [
      7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1
    ],
    expectedBingoCards: [
      [
        [22, 13, 17, 11, 0],
        [8, 2, 23, 4, 24],
        [21, 9, 14, 16, 7],
        [6, 10, 3, 18, 5],
        [1, 12, 20, 15, 19]
      ],
      [
        [3, 15, 0, 2, 22],
        [9, 18, 13, 17, 5],
        [19, 8, 7, 25, 23],
        [20, 11, 10, 24, 4],
        [14, 21, 16, 12, 6]
      ]
    ]
  }
];

export const outcomeTestDatasets: IBingoOutcomeTestDataset[] = [
  {
    label: 'Horizontal win on 14th Bingo call for 16',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
    `,
    expectedWin: true,
    expectedBingoCallCount: 14
  },
  {
    label: 'Vertical win on 14th Bingo call for 19',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,19,13,6,15,25,12,22,18,20,8,16,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
    `,
    expectedWin: true,
    expectedBingoCallCount: 14
  },
  {
    label: 'Simultaneous horizontal & vertical win on 21st Bingo call for 16',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,1,6,22,18,20,15,12,16,26,27,28,29,30,31
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
    `,
    expectedWin: true,
    expectedBingoCallCount: 21
  },
  {
    label: 'No win in 27 calls',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,1,6,22,18,20,15,12,25,26,27,28,29,30,31
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
    `,
    expectedWin: false,
    expectedBingoCallCount: 27
  }
];

export const multiCardOutcomeTestDatasets: IMultiBingoOutcomeTestDataset[] = [
  {
    label: 'Third card wins in 12 calls',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
      3 15 0 2 22
      9 18 13 17 5
      19 8 7 25 23
      20 11 10 24 4
      14 21 16 12 6
      14 21 17 24 4
      10 16 15 9 19
      18 8 23 26 20
      22 11 13 6 5
      2 0 12 3 7
    `,
    expectedWinningCards: [3],
    expectedBingoCallCount: 12
  },
  {
    label: 'Frist card wins in 14 calls',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
      3 15 0 2 22
      9 18 13 17 5
      19 8 7 25 23
      20 11 10 24 4
      14 21 16 12 6
    `,
    expectedWinningCards: [1],
    expectedBingoCallCount: 14
  },
  {
    label: 'Identical first & second cards win in 14 calls',
    bingoInput: dedent`
      7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
      22 13 17 11 0
      8 2 23 4 24
      21 9 14 16 7
      6 10 3 18 5
      1 12 20 15 19
    `,
    expectedWinningCards: [1, 2],
    expectedBingoCallCount: 14
  }
];
