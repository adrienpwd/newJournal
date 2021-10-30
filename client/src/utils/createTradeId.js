export default function createTradeId(trade) {
  return `${trade.ticker}-${trade.timestamp}`;
}
