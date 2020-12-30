export const strategies = [
  // Not Defined
  {
    id: 'not-defined',
    type: '',
    label: 'Not Defined',
    description: '',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  // Breakouts
  {
    id: 'wedge',
    type: 'breakout',
    label: 'Wedge',
    description: 'Trade the breakout of a Wedge pattern.',
    indicators: ['test 1', 'test2'],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'triangle',
    type: 'breakout',
    label: 'Triangle',
    description: 'Trade the breakout of a Triangle pattern.',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: '3-bars-play',
    type: 'breakout',
    label: '3 Bars Play',
    description: 'A scalp trade.',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'orb',
    type: 'breakout',
    label: 'ORB',
    description: 'Opening Range Breakout.',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [
      'You must wait to see the power of the other group first (Hammer if you are long)'
    ],
    screenshot: []
  },
  {
    id: 'range',
    type: 'breakout',
    label: 'Range Breakout',
    description:
      'Stock moves above or below a trading range after a clean consolidation. Usually moves away from support/resistance. It is always in the same direction of the existing move or trend.',
    indicators: {
      1: 'On the 60 min chart the stock clearly trade in a Range',
      2: 'The stock is coming into the breakout area after a pullback of maximum 50% of the range',
      3: 'There is a nice void before the next level of resistance (long), or before the next level of support (short)',
      4: 'The stock is not extended'
    },
    confirmations: {
      1: 'Volume comes in at the breakout area',
      2: 'Big Asks at the breakout area (long), or big Bids (short)',
      3: 'Times and Sales accelerates at the breakout area',
      4: 'There is more volume at the bottom of the range (long), or at the top of the range (short)'
    },
    adds: {
      1: 'At the breakout area if you entered in the range, and if it does not increase your risk',
      2: 'After the retest of the breakout area if it is on low volume',
      3: 'After a pullback (minimum 30%) if it does not increase your risk, and if it is only the 1st or 2nd leg'
    },
    stopLoss: {
      1: 'Entry in the range: below the range',
      2: 'Entry before the breakout: below the middle of the range',
      3: 'Entry after the break: below top of the range'
    },
    targets: {
      1: '50% at 3R',
      2: 'Next level of resitance/support',
      3: 'Whole $',
      4: 'After a big move on high volume'
    },
    rules: {
      1: 'There must be maximum 1 wick against your direction',
      2: 'There must be at least 4 candles in the range',
      3: 'Once the breakout happened you must move the stop to the middle of the range',
      4: 'If entering at the open, you must wait to see the power of the other group first (Hammer if you are long)',
      5: 'You must wait 3R to take the first partial (50%)',
      6: 'If a fake breakout happens in the opposite direction, you can re-enter'
    },
    screenshot: []
  },

  // Reversals
  {
    id: 'climactic-reversal',
    type: 'reversal',
    label: 'Climactic Reversal',
    description: 'Catch a pullback to the 9EMA on the 5min chart.',
    indicators: [],
    confirmations: [],
    adds: ['No add in this setup'],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'extreme-reversal',
    type: 'reversal',
    label: 'Extreme Reversal',
    description: 'A nice V reversal',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'mountain-pass',
    type: 'reversal',
    label: 'Mountain Pass',
    description: "Peter's Mountain Pass",
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },

  // Trends
  {
    id: 'abcd-1',
    type: 'trend',
    label: 'ABCD type 1',
    description: `ABCD that looks like an ascending triangle.
    The breakout happens after a long sideways consolidation.
    The MAs come closer and closer to the price.`,
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'abcd-2',
    type: 'trend',
    label: 'ABCD type 2',
    description: `ABCD where the consolidation slightly pulls back.
    The MAs come closer and closer to the price.`,
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'abcd-3',
    type: 'trend',
    label: 'ABCD type 3',
    description: 'ABCD where the pullback is parabolic.',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  },
  {
    id: 'trendline-break',
    type: 'trend',
    label: 'Trend Line Break',
    description: 'Trend Line Break',
    indicators: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    targets: [],
    rules: [],
    screenshot: []
  }
];

export const catalysts = [
  {
    id: 'earnings',
    label: 'Earnings (Day 1)',
    description: ''
  },
  {
    id: 'earnings-continuation',
    label: 'Earnings (continuation)',
    description: ''
  },
  { id: 'news', label: 'News', description: '' },
  { id: 'analyst-revision', label: 'Analyst revision', description: '' }
];

export const getStrategie = strategieId =>
  strategies.find(s => s.id === strategieId);
