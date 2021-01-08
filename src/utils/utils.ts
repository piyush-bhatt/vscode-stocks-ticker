import * as vscode from 'vscode';
import { INDICES_SUFFIX } from '../constants';
const EventEmitter = require('events');

export const roundToDecimal = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

// export const getAPIKey = (): string => vscode.workspace.getConfiguration('stocksTicker').get('apiKey', '');

// export const setAPIKey = (apiKey: string): Thenable<void> =>
//   vscode.workspace.getConfiguration().update('stocksTicker.apiKey', apiKey, vscode.ConfigurationTarget.Global);

export const getDifferenceViewOption = (): string =>
  vscode.workspace.getConfiguration('stocksTicker').get('differenceView', '');

export const setDifferenceViewOption = (value: string): Thenable<void> =>
  vscode.workspace.getConfiguration().update('stocksTicker.differenceView', value, vscode.ConfigurationTarget.Global);

export const getFavourites = (): string[] => vscode.workspace.getConfiguration('stocksTicker').get('favourites', []);

export const addToFavourites = async (value: string): Promise<void> => {
  const favourites = getFavourites();
  if (favourites.indexOf(value) === -1) {
    favourites.push(value);
  }
  await vscode.workspace
    .getConfiguration()
    .update('stocksTicker.favourites', favourites, vscode.ConfigurationTarget.Global);
};

export const removeFromFavourites = async (value: string): Promise<void> => {
  let favourites = getFavourites();
  favourites = favourites.filter((item: string) => item !== value);
  await vscode.workspace
    .getConfiguration()
    .update('stocksTicker.favourites', favourites, vscode.ConfigurationTarget.Global);
};

export const getWatchlist = (): string[] => vscode.workspace.getConfiguration('stocksTicker').get('watchlist', []);

export const addEntryToWatchlist = async (value: string): Promise<void> => {
  const watchlist = getWatchlist();
  if (watchlist.indexOf(value) === -1) {
    watchlist.push(value);
  }
  await vscode.workspace
    .getConfiguration()
    .update('stocksTicker.watchlist', watchlist, vscode.ConfigurationTarget.Global);
};

export const removeEntryFromWatchlist = async (value: string): Promise<void> => {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter((item: string) => item !== value);
  await vscode.workspace
    .getConfiguration()
    .update('stocksTicker.watchlist', watchlist, vscode.ConfigurationTarget.Global);
};

export const getSupportedIndices = () => Object.keys(INDICES_SUFFIX);

export const getSuffixForIndex = (index: string, country?: string): string => {
  if (index === 'Euronext' && country !== undefined) {
    return INDICES_SUFFIX[index][country];
  } else {
    return INDICES_SUFFIX[index];
  }
};

export const getTickerList = (): string[] => {
  const watchlist = getWatchlist();
  return watchlist.map((item: string) => {
    item = item.split(':')[1];
    return item.split('.')[1] === '' ? item.split('.')[0] : item;
  });
};

export const watchlistEventEmitter = new EventEmitter();

export const tickerEventEmitter = new EventEmitter();
