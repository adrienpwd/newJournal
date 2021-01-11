import React from 'react';
import { OrderedList, UnorderedList, ListItem } from 'carbon-components-react';

export default function Rules() {
  return (
    <div>
      <OrderedList>
        <ListItem>
          <h4>Stocks in Play</h4>
          <p>
            "You are only as good as the sdtocks that you trade".
            <br />I must only trade stocks in play:
          </p>
          <UnorderedList nested>
            <ListItem>Fresh news</ListItem>
            <ListItem>Up or down more than 2% before market opens</ListItem>
            <ListItem>Unusual pre-market activity</ListItem>
            <ListItem>
              Develops important intraday levels from which can trade off
            </ListItem>
          </UnorderedList>
        </ListItem>
        <ListItem>
          <h4>RVOL</h4>
          <p>
            Any stock I want to trade must have minimum 100% RVOL so I can trade
            it.
          </p>
        </ListItem>
        <ListItem>
          <h4>Void</h4>
          <p>
            Any stock I want to trade must have a Void.
            <br />I cannot trade into Resistance (Long) or Support (short)
            unless the R:R is reachable before
          </p>
        </ListItem>
        <ListItem>
          <h4>Timeframes</h4>
          <p>
            I must read the waves of the price action as they become available
            to me. Higher timeframes = more probability to work.
          </p>
          <UnorderedList nested>
            <ListItem>09:30 to 10:00 => 1min chart</ListItem>
            <ListItem>10:00 to 12:00 => 5min chart</ListItem>
            <ListItem>12:00 to 16:00 => 15min chart</ListItem>
          </UnorderedList>
          <p>
            My preferred timeframes to enter in a trade are 09:30 to 10:00 and
            14:00 to 15:30. <br />
            Between 10 a.m and noon it’s usually choppy and I should not look
            for breakout.
            <br />
            Then it’s the time for lunch at Wall Street, until 13:00 or 14:00.
            This time is not great either, I should not expect big move to
            happen at this time.
            <br />
            After 2 p.m is a great time for trading, until the close.
          </p>
        </ListItem>
        <ListItem>
          <h4>Stop Losses</h4>
          <p>
            I must always respect my stop loss. I can never increase my risk (by
            moving the stop because the trade doesn’t go in my direction).
            <br />I can only risk more than 1R on a trade if the realized P&L
            for that ticker allows my risk to stay at or below 1R.
            <br />I cannot choose a tight stop loss in order to get more shares
            and a bigger reward: stop losses must always be a technical level.
            <br />I should not move my stop to break even unless I have at least
            3 reasons to bail out on a trade.
          </p>
        </ListItem>
        <ListItem>
          <h4>Entries</h4>
          <p>
            I can only enter in a trade if the RvR is 2 or more.
            <br />I must aim for 3R whenever possible.
            <br />I can aim for 2R if I'm in a scalp trade.
          </p>
        </ListItem>
        <ListItem>
          <h4>Targets</h4>
          <p>
            Ideally my targets are chosen using technical levels, marked on the
            chart before I enter the trade.
            <br />I can also have arbitrary targets (2R, 3R, …).
            <br />I must respect my target, and cannot sell/cover before my
            original target, unless I have at least 3 reasons to do so.
          </p>
        </ListItem>
        <ListItem>
          <h4>3 consecutive bars up/down on the 5min</h4>
          <p>
            When a stock makes 3 consecutive bars up or down on the 5min chart,
            I consider it extended and I can’t enter.
            <br />I must wait for a better entry or a new low/high. I can also
            look on the 1min or 2min chart: if there are 5 consecutive bars on
            the 2min chart, it is extended, or 10 bars on the 1min.
          </p>
        </ListItem>
        <ListItem>
          <h4>9EMA on the 5 min</h4>
          <p>
            I must not go against it. If a setup is developing and I’m
            interested, I must verify that the 9EMA on the 5min chart is not in
            the way.
          </p>
        </ListItem>
        <ListItem>
          <h4>9 & 20 cross on 5 min</h4>
          <p>
            I must not go against it. Most traders and a lot of algorithms use
            this EMAs cross to trade. I must go with the flow.
          </p>
        </ListItem>
        <ListItem>
          <h4>P&L</h4>
          <p>
            I must not look at my P&L during trading. My goal is to take great
            trades, not to make money. The money is a byproduct of good trading.
            <br /> My goal is to make 3R each day, but I must not force a trade
            to achieve it.
          </p>
        </ListItem>
        <ListItem>
          <h4>Overtrading</h4>
          <p>
            My goal is to take One Good Trade each day.
            <br />
            My maximum number of trades per day is 5:
            <br />3 in the morning, 2 in the afternoon.
            <br />
            This will keep my commissions in check.
          </p>
        </ListItem>
        <ListItem>
          <h4>Max Loss</h4>
          <p>
            Daily: 3R
            <br />
            Weekly: 6R
            <br />
            Monthly: 15R
            <br />
            When I hit max loss I must go back to SIM for the rest of the
            period.
          </p>
        </ListItem>
        <ListItem>
          <h4>Scaling up</h4>
          <p>
            I can increase my R after each month where I do 20Rs.
            <br />
            Here is the scaling up plan:
            <br />
            First 6 steps: 10, 20, 30, 40, 50, 60
            <br />
            Next 6 steps: 80, 95, 110, 130, 150
            <br />
            I must go down one step if I have a red month.
            <br />
            If everything goes well, in one year I will reach my goal of $150
            per trade, which represent $450 for 3R, and is my goal to be able to
            only rely on trading for living.
            <br />I will come back here next year and see if I want or need to
            continue to scale up.
          </p>
        </ListItem>
        <ListItem>
          <h4>Reward and penalty system</h4>
          <p>
            When I respect all my rules I can have a reward like go skiing,
            mountain-biking, play music, … take an hour to do what I like.
            <br />
            It can also be a nice craft beer or a fine weed.
            <br />
            When I don’t, I will have a penalty: No good time, no beer, no weed,
            no sex, whatever works.
            <br />
            Note: when I don’t respect a rule because I didn’t remember it or
            because I didn’t see it, I must still have the penalty, it will help
            me memorize it.
          </p>
        </ListItem>
      </OrderedList>
    </div>
  );
}
