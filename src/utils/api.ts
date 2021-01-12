import { SYMBOL_SEARCH } from '../constants';
const axios = require('axios');
const yahooFinance = require('yahoo-finance');

export const searchSymbol = async (value: string) => {
  return await axios.get(SYMBOL_SEARCH, { params: { symbol: value } });
};

export const fetchQuote = async (symbol: string) => {
  return await yahooFinance.quote({
    symbol: symbol.split('.')[1] === '' ? symbol.split('.')[0] : symbol,
    modules: ['price'],
  });
};
