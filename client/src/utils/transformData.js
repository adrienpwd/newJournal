export const transformPNL = (data, account) => {
  const transformedData = [[], []];
  data.forEach(d => {
    if (d.accounts?.[account]) {
      const pnl = {
        x: d.id,
        y: d.accounts[account].net
      };
      const r = {
        x: d.id,
        y: d.accounts[account].r
      };

      transformedData[0].push(pnl);
      transformedData[1].push(r);
    } else {
      const empty = {
        x: d.id,
        y: null
      };
      transformedData[0].push(empty);
      transformedData[1].push(empty);
    }
  });

  return transformedData;
};

export const transformRstats = payload => {
  const bigLosers = {};
  const bigWinners = {};
  const losers = {};
  const winners = {};
  const totalTradesByAccount = {};

  const makeRbyAccount = (input, target) => {
    input.forEach(account => {
      target[account._id] = account.count;
    });
  };

  makeRbyAccount(payload.big_losers, bigLosers);
  makeRbyAccount(payload.big_winners, bigWinners);
  makeRbyAccount(payload.losers, losers);
  makeRbyAccount(payload.winners, winners);
  makeRbyAccount(payload.total_trades_by_account, totalTradesByAccount);

  return {
    bigLosers,
    bigWinners,
    losers,
    winners,
    totalTradesByAccount
  };
};
