import * as vscode from 'vscode';

export interface INotification extends vscode.QuickPickItem {
  symbol: string;
  limit: string;
  targetPrice: string;
  alertSound: string;
}

export interface INotificationInputState extends INotification {
  title: string;
  step: number;
  totalSteps: number;
  prevLimit: string;
  prevTargetPrice: string;
  prevAlertSound: string;
}
