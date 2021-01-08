import * as vscode from 'vscode';
import { updateStatusBarItem } from '../statusBar';
import { getDifferenceViewOption } from '../utils';

export class StockQuickPickItem implements vscode.QuickPickItem {
  public label: string;
  public description: string;
  public detail: string;
  constructor(
    public exchange: string,
    public symbol: string,
    public instrument_name: string,
    public country: string,
    public suffix: string,
  ) {
    this.label = `${exchange}: ${symbol}`;
    this.description = instrument_name;
    this.detail = country;
  }
}

export class StockTreeItem extends vscode.TreeItem {
  public label: string;
  constructor(
    public exchange: string,
    public symbol: string,
    public suffix: string,
    public contextValue: string,
    public price?: number,
    public change?: number,
    public changePercent?: number,
    public command?: vscode.Command,
  ) {
    super(`${exchange}: ${symbol}`);
    this.label = `${exchange}: ${symbol}`;
    this.tooltip = this.label;
    if (price !== undefined && change !== undefined && changePercent !== undefined) {
      const showChangeAsAmount = getDifferenceViewOption() === 'amount' ? true : false;
      this.description = `${price} (${showChangeAsAmount ? change : changePercent + '%'})`;
      if (change > 0) {
        const color = new vscode.ThemeColor('stocksTicker.watchlist.gain');
        this.iconPath = new vscode.ThemeIcon('arrow-up', color);
      } else if (change < 0) {
        const color = new vscode.ThemeColor('stocksTicker.watchlist.loss');
        this.iconPath = new vscode.ThemeIcon('arrow-down', color);
      }
      updateStatusBarItem(`${exchange}:${symbol}`, price, change, changePercent);
    }
  }
}
