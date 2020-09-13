export const transformPNL = (data, account) => {
  const transformedData = [[], []]
  data.forEach((d) => {
    if (d.accounts?.[account]) {
      const pnl = {
        x: d.id,
        y: d.accounts[account].net
      }
      const r = {
        x: d.id,
        y: d.accounts[account].r
      }

      transformedData[0].push(pnl)
      transformedData[1].push(r)
    } else {
      const empty = {
        x: d.id,
        y: null
      }
      transformedData[0].push(empty)
      transformedData[1].push(empty)
    }
  })

  return transformedData
}
