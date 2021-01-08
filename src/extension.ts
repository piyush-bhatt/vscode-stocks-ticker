import * as vscode from 'vscode';
import { StockTreeItem } from './model';
import { WatchlistProvider } from './provider';
import { openConfigureQuickPick, openStockPicker } from './quickPick';
import { createStatusBarItem, removeStatusBarItem, updateStatusBarItem } from './statusBar';
import {
  removeEntryFromWatchlist,
  watchlistEventEmitter,
  tickerEventEmitter,
  getFavourites,
  addToFavourites,
  removeFromFavourites,
} from './utils';

export function activate(context: vscode.ExtensionContext) {
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
    vscode.commands.registerCommand('stocksTicker.watchlist.removeEntry', async (stock: StockTreeItem) => {
      await removeEntryFromWatchlist(`${stock.exchange}:${stock.symbol}.${stock.suffix}`);
      removeFromFavourites(`${stock.exchange}:${stock.symbol}`);
      removeStatusBarItem(`${stock.exchange}:${stock.symbol}`);
      watchlistEventEmitter.emit('refresh');
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.markFavourite', (stock: StockTreeItem) => {
      addToFavourites(`${stock.exchange}:${stock.symbol}`);
      createStatusBarItem(`${stock.exchange}:${stock.symbol}`, stock.price, stock.change, stock.changePercent);
      watchlistProvider.refresh();
    }),
  );
  disposables.push(
    vscode.commands.registerCommand('stocksTicker.watchlist.unmarkFavourite', (stock: StockTreeItem) => {
      removeFromFavourites(`${stock.exchange}:${stock.symbol}`);
      removeStatusBarItem(`${stock.exchange}:${stock.symbol}`);
      watchlistProvider.refresh();
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
    },
  );
  const favourites = getFavourites();
  favourites.forEach((item: string) => {
    createStatusBarItem(item);
  });
  context.subscriptions.push(...disposables);
}

export function deactivate() {}
