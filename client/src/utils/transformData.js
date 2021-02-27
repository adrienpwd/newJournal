export const transformPNL = (data, account) => {
  const transformedData = [[], []]

  const filteredData = data.filter((d) => account in (d?.accounts || []))
  const pnlArray = filteredData.map((d) => d.accounts?.[account].net)

  filteredData.forEach((d, i) => {
    if (d.accounts?.[account]) {
      const myArr = pnlArray.slice(0, i + 1)
      const sumPnl = {
        x: d.id,
        y: myArr.reduce((a, b) => a + b).toFixed(2)
      }
      const r = {
        x: d.id,
        y: d.accounts[account].r
      }

      transformedData[0].push(sumPnl)
      transformedData[1].push(r)
    }
  })

  return transformedData
}

export const transformRstats = (payload) => {
  const bigLosers = {}
  const bigWinners = {}
  const losers = {}
  const winners = {}
  const totalTradesByAccount = {}

  const makeRbyAccount = (input, target) => {
    input.forEach((account) => {
      target[account._id] = account.count
    })
  }

  makeRbyAccount(payload.big_losers, bigLosers)
  makeRbyAccount(payload.big_winners, bigWinners)
  makeRbyAccount(payload.losers, losers)
  makeRbyAccount(payload.winners, winners)
  makeRbyAccount(payload.total_trades_by_account, totalTradesByAccount)

  return {
    bigLosers,
    bigWinners,
    losers,
    winners,
    totalTradesByAccount
  }
}
