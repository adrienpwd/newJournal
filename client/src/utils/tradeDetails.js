export const strategies = [
  {
    id: 'breakout',
    label: 'Breakout',
    description: `A classic breakout where you look at the 60 min chart to see the range, and spot the best entry using the 1 min chart.`
  },
  {
    id: 'abcd-a',
    label: 'ABCD (type A)',
    description: `ABCD that looks like an ascending triangle.
    The breakout happens after a long sideways consolidation.
    The MAs come closer and closer to the price.`
  },
  {
    id: 'abcd-b',
    label: 'ABCD (type B)',
    description: `ABCD where the consolidation slightly pulls back.
    The MAs come closer and closer to the price.`
  },
  {
    id: 'abcd-c',
    label: 'ABCD (type C)',
    description: 'ABCD where the pullback is parabolic.'
  },
  {
    id: 'climactic-reversal',
    label: 'Climactic Reversal',
    description: 'Catch a pullback to the 9EMA on the 5min chart.'
  },
  {
    id: 'extreme-reversal',
    label: 'Extreme Reversal',
    description: 'A nice V reversal'
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
