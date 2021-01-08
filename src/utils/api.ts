import { SYMBOL_SEARCH } from '../constants';
const axios = require('axios');

export const searchSymbol = async (value: string) => {
  return await axios.get(SYMBOL_SEARCH, { params: { symbol: value } });
};
