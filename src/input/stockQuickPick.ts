import * as vscode from 'vscode';
import { StockQuickPickItem } from '../model';
import {
  addEntryToWatchlist,
  fetchQuote,
  getSuffixForIndex,
  getSupportedIndices,
  roundToDecimal,
  searchSymbol,
  showInformationMessage,
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
      let data = res.data.data.filter(
        (v: any, i: number, a: any) =>
          a.findIndex((t: any) => t.symbol === v.symbol && t.exchange === v.exchange && t.country === v.country) === i,
      );
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
  stockQuickPick.onDidHide(() => stockQuickPick.dispose());
  stockQuickPick.show();
};

export const openStockPickerForPriceQuote = async () => {
  const stockQuickPick = vscode.window.createQuickPick<StockQuickPickItem>();
  stockQuickPick.title = 'Search for a stock symbol to get price quote';
  stockQuickPick.onDidChangeValue(async (value: string) => {
    stockQuickPick.busy = true;
    const res = await searchSymbol(value);
    if (res.status == 200 && res.data.status == 'ok') {
      let data = res.data.data.filter(
        (v: any, i: number, a: any) =>
          a.findIndex((t: any) => t.symbol === v.symbol && t.exchange === v.exchange && t.country === v.country) === i,
      );
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
    stockQuickPick.selectedItems.forEach(async (item: any) => {
      const quote = await fetchQuote(`${item.symbol}.${item.suffix}`);
      if (quote !== undefined) {
        showInformationMessage(
          `Recent market price for ${item.symbol} on ${item.exchange} is ${quote.price.currencySymbol}${roundToDecimal(quote.price.regularMarketPrice)}`,
        );
      } else {
        showInformationMessage('Could not fetch quote at this moment');
      }
    });
    stockQuickPick.hide();
  });
  stockQuickPick.onDidHide(() => stockQuickPick.dispose());
  stockQuickPick.show();
};
