export {
  getDifferenceViewOption,
  setDifferenceViewOption,
  getFavourites,
  addToFavourites,
  removeFromFavourites,
  getWatchlist,
  addEntryToWatchlist,
  removeEntryFromWatchlist,
  getNotifications,
  addOrUpdateNotification,
  isValidNotificationInputState,
  getSupportedIndices,
  getTickerList,
  getSuffixForIndex,
  roundToDecimal,
  getAlertSoundList,
  notifyIfNeeded,
  playSound,
  watchlistEventEmitter,
  tickerEventEmitter,
} from './utils';
export { searchSymbol, fetchQuote } from './api';
export { ticker } from './ticker';
