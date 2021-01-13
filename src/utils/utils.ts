import * as fs from 'fs';
import * as vscode from 'vscode';
import cp = require('child_process');
const player = require('node-wav-player');
import { INDICES_SUFFIX } from '../constants';
import { getContext } from '../context';
import { INotification, INotificationInputState } from '../types';
import { fetchQuote } from './api';
const EventEmitter = require('events');

export const roundToDecimal = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

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

export const refreshEntryInWatchlist = async (symbol: string) => {
  const quote = await fetchQuote(symbol);
  if (quote !== undefined) {
    tickerEventEmitter.emit(
      'refreshPrice',
      quote.price.symbol,
      quote.price.exchangeName,
      roundToDecimal(quote.price.regularMarketPrice),
      roundToDecimal(quote.price.regularMarketChange),
      roundToDecimal(quote.price.regularMarketChangePercent),
    );
  }
};

export const getNotifications = (): INotification[] =>
  vscode.workspace.getConfiguration('stocksTicker').get('notifications', []);

const getNotification = ({ symbol, limit, targetPrice, alertSound }: INotification): INotification | undefined =>
  vscode.workspace
    .getConfiguration('stocksTicker')
    .get('notifications', [])
    .find(
      (item: INotification) =>
        item.symbol === symbol &&
        item.limit === limit &&
        item.targetPrice == targetPrice &&
        item.alertSound == alertSound,
    );

const getNotificationIndex = (symbol: string, targetPrice: string, limit: string) =>
  getNotifications().findIndex(
    (item: INotification) => item.symbol === symbol && item.targetPrice === targetPrice && item.limit === limit,
  );

const addNotification = async (notification: INotification): Promise<void> => {
  const notifications = getNotifications();
  const index = getNotificationIndex(notification.symbol, notification.targetPrice, notification.limit);
  if (index === -1) {
    notifications.push(notification);
    await vscode.workspace
      .getConfiguration()
      .update('stocksTicker.notifications', notifications, vscode.ConfigurationTarget.Global);
  }
};

export const removeNotification = async (symbol: string, targetPrice: string, limit: string): Promise<void> => {
  let notifications = getNotifications();
  const index = getNotificationIndex(symbol, targetPrice, limit);
  notifications.splice(index, 1);
  await vscode.workspace
    .getConfiguration()
    .update('stocksTicker.notifications', notifications, vscode.ConfigurationTarget.Global);
};

export const addOrUpdateNotification = (notificationInputState: INotificationInputState) => {
  const notification = getNotification({
    label: notificationInputState.label,
    symbol: notificationInputState.symbol,
    targetPrice: notificationInputState.prevTargetPrice,
    limit: notificationInputState.prevLimit,
    alertSound: notificationInputState.prevAlertSound,
  });
  if (notification !== undefined) {
    removeNotification(notification.symbol, notification.targetPrice, notification.limit);
  }
  addNotification({
    label: notificationInputState.label,
    symbol: notificationInputState.symbol,
    targetPrice: notificationInputState.targetPrice,
    limit: notificationInputState.limit,
    alertSound: notificationInputState.alertSound,
  });
};

export const isValidNotificationInputState = (notificationInputState: INotificationInputState): boolean =>
  notificationInputState.targetPrice !== undefined &&
  notificationInputState.symbol !== undefined &&
  notificationInputState.limit !== undefined &&
  notificationInputState.alertSound !== undefined;

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

export const getAlertSoundList = (): string[] =>
  fs
    .readdirSync(getContext().asAbsolutePath('media/audio'))
    .filter((fileName: string) => fileName.match(new RegExp(`^.*\.(wav)$`, 'ig')))
    .map((fileName: string) => fileName.split('.')[0]);

export const notifyIfNeeded = (symbol: string, price: number): void => {
  const notifications = vscode.workspace
    .getConfiguration('stocksTicker')
    .get('notifications', [])
    .filter((item: INotification) => item.symbol === symbol);
  notifications.forEach((notification: INotification) => {
    if (
      notification.limit === 'Upper' &&
      price >= parseInt(notification.targetPrice) &&
      notification.alertSound !== 'None'
    ) {
      removeNotification(symbol, notification.targetPrice, notification.limit);
      playSound(notification.alertSound);
      showInformationMessage(`${symbol} price reached ${price}`);
    } else if (
      notification.limit === 'Lower' &&
      price <= parseInt(notification.targetPrice) &&
      notification.alertSound !== 'None'
    ) {
      removeNotification(symbol, notification.targetPrice, notification.limit);
      playSound(notification.alertSound);
      showInformationMessage(`${symbol} price reached ${price}`);
    }
  });
};

export const showInformationMessage = (message: string) => {
  vscode.window.showInformationMessage(message);
};

export const playSound = (sound: string): void => {
  const soundFilePath = getContext().asAbsolutePath(`media/audio/${sound}.wav`);
  player
    .play({ path: soundFilePath })
    .then(() => {})
    .catch((error: any) => {});
};

export const watchlistEventEmitter = new EventEmitter();

export const tickerEventEmitter = new EventEmitter();
