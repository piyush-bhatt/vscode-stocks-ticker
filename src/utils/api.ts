import { SYMBOL_SEARCH } from '../constants';
import { roundToDecimal, tickerEventEmitter } from '../utils';
const axios = require('axios');
const yahooFinance = require('yahoo-finance');

export const searchSymbol = async (value: string) => {
  return await axios.get(SYMBOL_SEARCH, { params: { symbol: value } });
};

export const fetchQuote = async (symbol: string) => {
  const quote = await yahooFinance.quote({
    symbol: symbol,
    modules: ['price']
  });
  tickerEventEmitter.emit(
    'refreshPrice',
    quote.symbol,
    quote.exchange,
    roundToDecimal(quote.regularMarketPrice),
    roundToDecimal(quote.regularMarketChange),
    roundToDecimal(quote.regularMarketChangePercent),
  );
}
