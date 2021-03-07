export const strategies = [
  // Not Defined
  {
    id: 'not-defined',
    type: '',
    label: 'Not Defined',
    description: '',
    requirements: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    screenshot: []
  },
  // Breakouts
  {
    id: '3-bars-play',
    type: 'breakout',
    label: '3 Bars Play',
    description: 'A scalp trade.',
    requirements: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    screenshot: []
  },
  {
    id: 'range',
    type: 'breakout',
    label: 'Range Breakout',
    description:
      'Stock moves above or below a trading range after a clean consolidation. Usually moves away from support/resistance. It is always in the same direction of the existing move or trend.',
    requirements: {
      // Known when creating seed
      flat60: {
        id: 'flat60',
        description: 'Flat top on 60 min',
        required: true
      },
      '4candles60': {
        id: '4candles60',
        description: '4 candles minimum in the 60 min range',
        required: true
      },
      noWick: {
        id: 'noWick',
        description:
          'No wick against your direction, or entry after break of wicks',
        required: true
      },
      rvol: { id: 'rvol', description: '90% or more RVOL', required: true },
      void: {
        id: 'void',
        description: 'Void above breakout, or minimum 3R doable',
        required: true
      }
    },
    confirmations: {
      // Known when entering the trade
      miniSetup: {
        id: 'miniSetup',
        description: 'Setup on 1 or 5min',
        required: true
      },
      independant: {
        id: 'independant',
        description: 'Trading independently of the market',
        required: true
      },
      notExtended: {
        id: 'notExtended',
        description: 'Not extended (3 consecutive candles on 5 min)',
        required: true
      },
      volume: {
        id: 'volume',
        description: 'Volume comes in at the breakout area',
        required: false
      },
      askOrBid: {
        id: 'askOrBid',
        description:
          'Big Asks at the breakout area (long), or big Bids (short)',
        required: false
      },
      tsAccelerate: {
        id: 'tsAccelerate',
        description: 'Times and Sales accelerates at the breakout area',
        required: false
      },
      rangeVolume: {
        id: 'rangeVolume',
        description:
          'There is more volume at the bottom of the range (buying pressure), or at the top of the range (selling pressure)',
        required: false
      }
    },
    adds: {
      addAtBreak: {
        id: 'addAtBreak',
        description:
          'At the breakout area if you entered in the range, and if it does not increase your risk'
      },
      addAtRetest: {
        id: 'addAtRetest',
        description:
          'After the retest of the breakout area if it is on low volume'
      },
      addPullback: {
        id: 'addPullback',
        description:
          'After a pullback (minimum 30%) if it does not increase your risk, and if it is only the 1st or 2nd leg'
      },
      noAdd: {
        id: 'noAdd',
        description: 'No adds'
      },
      noAddRespect: {
        id: 'noAddRespect',
        description: 'Did not respect adding rules'
      }
    },
    stopLoss: {
      entryBeforeBreak: {
        id: 'entryBeforeBreak',
        description: 'Entry in the range: below the range'
      },
      entryAtBreak: {
        id: 'entryAtBreak',
        description: 'Entry at the breakout: below the middle of the range'
      },
      entryAfterBreak: {
        id: 'entryAfterBreak',
        description: 'Entry after the break: below top of the range'
      },
      noStopRespect: {
        id: 'noStopRespect',
        description: 'Did not respect stop rules'
      },
      manualExit: {
        id: 'manualExit',
        description: 'Exited manually before my stop'
      },
      manualExitWithoutReason: {
        id: 'manualExitWithoutReason',
        description: 'Exited manually before my stop for no reason'
      }
    },
    screenshot: []
  },

  // Reversals
  {
    id: 'climactic-reversal',
    type: 'reversal',
    label: 'Climactic Reversal',
    description: 'Catch a pullback to the 9EMA on the 5min chart.',
    requirements: [],
    confirmations: [],
    adds: ['No add in this setup'],
    stopLoss: [],
    screenshot: []
  },
  {
    id: 'extreme-reversal',
    type: 'reversal',
    label: 'Extreme Reversal',
    description: 'A nice V reversal',
    requirements: [],
    confirmations: [],
    adds: [],
    stopLoss: [],
    screenshot: []
  }

  // Trends
  // {
  //   id: 'abcd-1',
  //   type: 'trend',
  //   label: 'ABCD type 1',
  //   description: `ABCD that looks like an ascending triangle.
  //   The breakout happens after a long sideways consolidation.
  //   The MAs come closer and closer to the price.`,
  //   requirements: [],
  //   confirmations: [],
  //   adds: [],
  //   stopLoss: [],
  //   screenshot: []
  // },
  // {
  //   id: 'abcd-2',
  //   type: 'trend',
  //   label: 'ABCD type 2',
  //   description: `ABCD where the consolidation slightly pulls back.
  //   The MAs come closer and closer to the price.`,
  //   requirements: [],
  //   confirmations: [],
  //   adds: [],
  //   stopLoss: [],
  //   screenshot: []
  // },
  // {
  //   id: 'abcd-3',
  //   type: 'trend',
  //   label: 'ABCD type 3',
  //   description: 'ABCD where the pullback is parabolic.',
  //   requirements: [],
  //   confirmations: [],
  //   adds: [],
  //   stopLoss: [],
  //   screenshot: []
  // },
  // {
  //   id: 'trendline-break',
  //   type: 'trend',
  //   label: 'Trend Line Break',
  //   description: 'Trend Line Break',
  //   requirements: [],
  //   confirmations: [],
  //   adds: [],
  //   stopLoss: [],
  //   screenshot: []
  // }
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
