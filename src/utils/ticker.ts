import { getTickerList, roundToDecimal, tickerEventEmitter } from './utils';
const { YahooFinanceTicker } = require('yahoo-finance-ticker');

export const ticker = new YahooFinanceTicker();

ticker.subscribe(getTickerList(), (ticker: any) => {
  tickerEventEmitter.emit(
    'refreshPrice',
    ticker.id,
    ticker.exchange,
    roundToDecimal(ticker.price),
    roundToDecimal(ticker.change),
    roundToDecimal(ticker.changePercent),
  );
});

tickerEventEmitter.on('refresh', () => {
  ticker.subscribe(getTickerList(), (ticker: any) => {
    tickerEventEmitter.emit(
      'refreshPrice',
      ticker.id,
      ticker.exchange,
      roundToDecimal(ticker.price),
      roundToDecimal(ticker.change),
      roundToDecimal(ticker.changePercent),
    );
  });
});
