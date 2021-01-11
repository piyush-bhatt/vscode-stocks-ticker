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
  watchlistEventEmitter,
  tickerEventEmitter,
} from './utils';
export { searchSymbol } from './api';
export { ticker } from './ticker';
