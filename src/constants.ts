// API endpoints
export const SYMBOL_SEARCH: string = 'https://api.twelvedata.com/symbol_search';

// Suffixes for indices
export const INDICES_SUFFIX: any = {
  NYSE: '',
  NASDAQ: '',
  NSE: 'NS',
  BSE: 'BO',
  ASX: 'AX',
  Euronext: {
    Belgium: 'BR',
    France: 'PA',
    Netherlands: 'AS',
  },
  Bovespa: 'SA',
  CNQ: 'CN',
  NEO: 'NE',
  TSX: 'TO',
  TSXV: 'V',
  OMXC: 'CO',
  OMXH: 'HE',
  FSX: 'F',
  XHAM: 'HM',
  XETR: 'DE',
  Munich: 'MU',
  XSTU: 'SG',
  XDUS: 'DU',
  HKEX: 'HK',
  OSE: 'OL',
  MOEX: 'ME',
  BME: 'MC',
  OMX: 'ST',
  BIST: 'IS',
  LSE: 'L',
};
