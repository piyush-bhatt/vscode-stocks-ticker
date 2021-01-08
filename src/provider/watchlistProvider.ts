import * as vscode from 'vscode';
import { StockTreeItem } from '../model';
import { getFavourites, getWatchlist } from '../utils';

export class WatchlistProvider implements vscode.TreeDataProvider<StockTreeItem> {
  private _prices: Record<string, Record<string, number>> = {};
  private _onDidChangeTreeData: vscode.EventEmitter<StockTreeItem | undefined | null | void> = new vscode.EventEmitter<
    StockTreeItem | undefined | null | void
  >();
  readonly onDidChangeTreeData: vscode.Event<StockTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  refreshPrice(id: string, price: number, change: number, changePercent: number) {
    this._prices[id] = { price, change, changePercent };
    this.refresh();
  }

  getTreeItem(element: StockTreeItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: StockTreeItem): Thenable<StockTreeItem[]> {
    return Promise.resolve(this.getStocks());
  }

  private async getStocks(): Promise<StockTreeItem[]> {
    let items: StockTreeItem[];
    const favourites = getFavourites();
    items = getWatchlist().map((item: string) => {
      let contextValue: string;
      if (favourites.indexOf(item.split('.')[0]) !== -1) {
        contextValue = 'stock+favourite';
      } else {
        contextValue = 'stock';
      }
      const stockTreeItem = new StockTreeItem(
        item.split('.')[0].split(':')[0],
        item.split('.')[0].split(':')[1],
        item.split('.')[1],
        contextValue,
        this._prices[item.split(':')[1]] !== undefined ? this._prices[item.split(':')[1]].price : undefined,
        this._prices[item.split(':')[1]] !== undefined ? this._prices[item.split(':')[1]].change : undefined,
        this._prices[item.split(':')[1]] !== undefined ? this._prices[item.split(':')[1]].changePercent : undefined,
      );
      return stockTreeItem;
    });
    return items;
  }
}
