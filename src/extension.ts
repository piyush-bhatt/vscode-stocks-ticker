import * as vscode from 'vscode';
import { setContext } from './context';
import { StockTreeItem } from './model';
import { WatchlistProvider } from './provider';
import { openConfigureQuickPick, openMultiStepInput, openStockPicker } from './input';
import { createStatusBarItem, removeStatusBarItem, updateStatusBarItem } from './statusBar';
import {
  removeEntryFromWatchlist,
  watchlistEventEmitter,
  tickerEventEmitter,
  getFavourites,
  addToFavourites,
  removeFromFavourites,
  addOrUpdateNotification,
  notifyIfNeeded,
} from './utils';

export function activate(context: vscode.ExtensionContext) {
  setContext(context);
  const watchlistProvider = new WatchlistProvider();
  let disposables: vscode.Disposable[] = [];
  disposables.push(vscode.window.registerTreeDataProvider('stocksTicker.watchlist', watchlistProvider));
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.configure', async () => {
      openConfigureQuickPick();
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.addEntry', () => {
      openStockPicker();
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.refresh', () => {
      watchlistEventEmitter.emit('refresh');
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.removeEntry', async (stock: StockTreeItem) => {
      await removeEntryFromWatchlist(`${stock.exchange}:${stock.symbol}.${stock.suffix}`);
      removeFromFavourites(`${stock.exchange}:${stock.symbol}`);
      removeStatusBarItem(`${stock.exchange}:${stock.symbol}`);
      watchlistEventEmitter.emit('refresh');
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.markFavourite', async (stock: StockTreeItem) => {
      await addToFavourites(`${stock.exchange}:${stock.symbol}`);
      createStatusBarItem(`${stock.exchange}:${stock.symbol}`, stock.price, stock.change, stock.changePercent);
      watchlistProvider.refresh();
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.unmarkFavourite', async (stock: StockTreeItem) => {
      await removeFromFavourites(`${stock.exchange}:${stock.symbol}`);
      removeStatusBarItem(`${stock.exchange}:${stock.symbol}`);
      watchlistProvider.refresh();
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.notification', async (stock: StockTreeItem) => {
      const notificationInputState = await openMultiStepInput(`${stock.exchange}:${stock.symbol}`);
      if (notificationInputState !== undefined) {
        addOrUpdateNotification(notificationInputState);
      }
      // watchlistProvider.refresh();
    }),
  );
  watchlistEventEmitter.on('refresh', () => {
    watchlistProvider.refresh();
    tickerEventEmitter.emit('refresh');
  });
  tickerEventEmitter.on(
    'refreshPrice',
    (id: string, exchange: string, price: number, change: number, changePercent: number) => {
      watchlistProvider.refreshPrice(id, price, change, changePercent);
      const symbol = id.split('.')[0];
      updateStatusBarItem(`${exchange}:${symbol}`, price, change, changePercent);
      notifyIfNeeded(`${exchange}:${symbol}`, price);
    },
  );
  const favourites = getFavourites();
  favourites.forEach((item: string) => {
    createStatusBarItem(item);
  });
  context.subscriptions.push(...disposables);
}

export function deactivate() {}
