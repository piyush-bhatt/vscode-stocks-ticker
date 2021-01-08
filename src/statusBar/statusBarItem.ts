import * as vscode from 'vscode';
import { getDifferenceViewOption } from '../utils';

const statusBarItems: Record<string, vscode.StatusBarItem> = {};

export const createStatusBarItem = (symbol: string, price?: number, change?: number, changePercent?: number) => {
  if (statusBarItems[symbol] === undefined) {
    const priority = Object.keys(statusBarItems).length;
    const statusBarItem: vscode.StatusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      priority + 1,
    );
    if (price !== undefined && change !== undefined) {
      const showChangeAsAmount = getDifferenceViewOption() === 'amount' ? true : false;
      statusBarItem.text = `${symbol} ${price} (${showChangeAsAmount ? change : changePercent + '%'})`;
      if (change > 0) {
        statusBarItem.color = new vscode.ThemeColor('stocksTicker.statusBar.gain');
      } else if (change < 0) {
        statusBarItem.color = new vscode.ThemeColor('stocksTicker.statusBar.loss');
      }
    } else {
      statusBarItem.text = symbol;
    }
    statusBarItems[symbol] = statusBarItem;
    statusBarItem.show();
  }
};

export const updateStatusBarItem = (symbol: string, price: number, change: number, changePercent: number) => {
  const statusBarItem = statusBarItems[symbol];
  if (statusBarItem !== undefined) {
    statusBarItem.hide();
    const showChangeAsAmount = getDifferenceViewOption() === 'amount' ? true : false;
    statusBarItem.text = `${symbol} ${price} (${showChangeAsAmount ? change : changePercent + '%'})`;
    if (change > 0) {
      statusBarItem.color = new vscode.ThemeColor('stocksTicker.statusBar.gain');
    } else if (change < 0) {
      statusBarItem.color = new vscode.ThemeColor('stocksTicker.statusBar.loss');
    }
    statusBarItem.show();
  }
};

export const removeStatusBarItem = (symbol: string) => {
  const statusBarItem = statusBarItems[symbol];
  if (statusBarItem !== undefined) {
    statusBarItem.hide();
    delete statusBarItems[symbol];
  }
};
