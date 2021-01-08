import * as vscode from 'vscode';
import { StockQuickPickItem } from '../model';
import {
  addEntryToWatchlist,
  getSuffixForIndex,
  getSupportedIndices,
  searchSymbol,
  watchlistEventEmitter,
} from '../utils';

export const openStockPicker = async () => {
  const stockQuickPick = vscode.window.createQuickPick<StockQuickPickItem>();
  stockQuickPick.title = 'Enter Stock symbol to add to watchlist';
  stockQuickPick.canSelectMany = true;
  stockQuickPick.onDidChangeValue(async (value: string) => {
    stockQuickPick.busy = true;
    const res = await searchSymbol(value);
    if (res.status == 200 && res.data.status == 'ok') {
      let data = res.data.data;
      const supportedIndices = getSupportedIndices();
      data = data
        .map((item: any) => {
          if (supportedIndices.indexOf(item.exchange) !== -1) {
            const suffix = getSuffixForIndex(item.exchange, item.country);
            return new StockQuickPickItem(item.exchange, item.symbol, item.instrument_name, item.country, suffix);
          }
        })
        .filter((item: StockQuickPickItem) => item !== undefined);
      stockQuickPick.items = [];
      stockQuickPick.items = stockQuickPick.items.concat(data);
    }
    stockQuickPick.busy = false;
  });
  stockQuickPick.onDidAccept(() => {
    stockQuickPick.selectedItems.forEach((item: any) => {
      addEntryToWatchlist(`${item.exchange}:${item.symbol}.${item.suffix}`);
    });
    stockQuickPick.hide();
    if (stockQuickPick.selectedItems.length > 0) {
      watchlistEventEmitter.emit('refresh');
    }
  });
  stockQuickPick.show();
};
