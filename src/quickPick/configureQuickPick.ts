import * as vscode from 'vscode';
import { setDifferenceViewOption, tickerEventEmitter } from '../utils';

export const openConfigureQuickPick = async () => {
  const items = ['amount', 'percentage'];
  const selection = await vscode.window.showQuickPick(items, {
    canPickMany: false,
    placeHolder: 'Select an option to view the differences in',
  });
  if (selection !== undefined) {
    await setDifferenceViewOption(selection);
    tickerEventEmitter.emit('refresh');
  }
};
