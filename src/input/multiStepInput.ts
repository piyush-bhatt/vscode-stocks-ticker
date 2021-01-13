import { QuickPickItem, window, Disposable, QuickInputButton, QuickInput, QuickInputButtons, ThemeIcon } from 'vscode';
import { INotification, INotificationInputState } from '../types';
import {
  getAlertSoundList,
  getNotifications,
  isValidNotificationInputState,
  playSound,
  removeNotification,
} from '../utils';

export const openMultiStepInput = async (symbol: string): Promise<INotificationInputState | undefined> => {
  const notifications: INotification[] = getNotifications().filter((item: INotification) => item.symbol === symbol);

  class Button implements QuickInputButton {
    constructor(public iconPath: ThemeIcon, public tooltip: string) {}
  }

  const createNotificationButton = new Button(new ThemeIcon('add'), 'Create Notification');

  async function collectInputs() {
    const state = {} as Partial<INotificationInputState>;
    await MultiStepInput.run((input) => chooseNotification(input, state));
    return state as INotificationInputState;
  }

  async function chooseNotification(input: MultiStepInput, state: Partial<INotificationInputState>) {
    const pick = (await input.showQuickPick({
      title: 'Add or Edit a notification',
      step: 1,
      totalSteps: 4,
      placeholder: notifications.length === 0 ? 'Click on the + button to add a notification' : '',
      items: notifications,
      buttons: [createNotificationButton],
    })) as INotification | Button;
    if (pick instanceof Button) {
      state.symbol = symbol;
      return (input: MultiStepInput) => setTargetPrice(input, state, 0);
    }
    state.symbol = pick.symbol;
    state.prevTargetPrice = pick.targetPrice;
    state.prevLimit = pick.limit;
    state.prevAlertSound = pick.alertSound;
    return (input: MultiStepInput) => chooseAction(input, state, 1);
  }

  async function chooseAction(input: MultiStepInput, state: Partial<INotificationInputState>, additionalSteps: number) {
    const actions: QuickPickItem[] = ['Edit', 'Delete'].map((label) => ({ label }));
    const action = await input.showQuickPick({
      title: 'Choose an Action',
      step: 2,
      totalSteps: 5,
      placeholder: '',
      items: actions,
    });
    if (action.label == 'Edit') {
      return (input: MultiStepInput) => setTargetPrice(input, state, additionalSteps);
    } else if (action.label == 'Delete') {
      removeNotification(state.symbol!, state.prevTargetPrice!, state.prevLimit!);
    }
  }

  async function setTargetPrice(
    input: MultiStepInput,
    state: Partial<INotificationInputState>,
    additionalSteps: number,
  ) {
    state.targetPrice = await input.showInputBox({
      title: 'Set Target Price',
      step: 2 + additionalSteps,
      totalSteps: 4 + additionalSteps,
      value: state.prevTargetPrice || '',
      prompt: '',
      validate: validateTargetPrice,
    });
    return (input: MultiStepInput) => setLimit(input, state, additionalSteps);
  }

  async function setLimit(input: MultiStepInput, state: Partial<INotificationInputState>, additionalSteps: number) {
    const limits: QuickPickItem[] = ['Upper', 'Lower'].map((label) => ({ label }));
    const limit = await input.showQuickPick({
      title: 'Set a Limit',
      step: 3 + additionalSteps,
      totalSteps: 4 + additionalSteps,
      placeholder: state.prevLimit || '',
      items: limits,
      activeItem: { label: state.prevLimit || '' },
    });
    state.limit = limit.label;
    return (input: MultiStepInput) => setAlertSound(input, state, additionalSteps);
  }

  async function setAlertSound(
    input: MultiStepInput,
    state: Partial<INotificationInputState>,
    additionalSteps: number,
  ) {
    let alerts: QuickPickItem[] = getAlertSoundList().map((label) => ({ label }));
    alerts = [{ label: 'None' }].concat(alerts);
    const alertSound = await input.showQuickPick({
      title: 'Choose an alert sound',
      step: 4 + additionalSteps,
      totalSteps: 4 + additionalSteps,
      placeholder: state.prevAlertSound || '',
      items: alerts,
      activeItem: { label: state.prevAlertSound || '' },
      onDidChangeActive: playSampleSound,
    });
    state.alertSound = alertSound.label;
  }

  function playSampleSound(item: QuickPickItem) {
    if (item.label !== 'None') {
      playSound(item.label);
    }
  }

  function validateTargetPrice(value: string): string {
    const regex = /^\d+(\.\d{1,2})?$/;
    return regex.test(value) ? '' : 'Enter a valid number upto two decimal places';
  }
  const state = await collectInputs();
  if (isValidNotificationInputState(state)) {
    state.label = `${state.symbol} - ${state.limit} limit set at ${state.targetPrice}`;
    return state;
  }
  return undefined;
};

class InputFlowAction {
  static back = new InputFlowAction();
  static cancel = new InputFlowAction();
  static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
  title: string;
  step: number;
  totalSteps: number;
  items: T[];
  activeItem?: T;
  placeholder: string;
  buttons?: QuickInputButton[];
  onDidChangeActive?: (value: QuickPickItem) => void;
  shouldResume?: () => Thenable<boolean>;
}

interface InputBoxParameters {
  title: string;
  step: number;
  totalSteps: number;
  value: string;
  prompt: string;
  validate: (value: string) => string;
  buttons?: QuickInputButton[];
  shouldResume?: () => Thenable<boolean>;
}

class MultiStepInput {
  static async run<T>(start: InputStep) {
    const input = new MultiStepInput();
    return input.stepThrough(start);
  }

  private current?: QuickInput;
  private steps: InputStep[] = [];

  private async stepThrough<T>(start: InputStep) {
    let step: InputStep | void = start;
    while (step) {
      this.steps.push(step);
      if (this.current) {
        this.current.enabled = false;
        this.current.busy = true;
      }
      try {
        step = await step(this);
      } catch (err) {
        if (err === InputFlowAction.back) {
          this.steps.pop();
          step = this.steps.pop();
        } else if (err === InputFlowAction.resume) {
          step = this.steps.pop();
        } else if (err === InputFlowAction.cancel) {
          step = undefined;
        } else {
          throw err;
        }
      }
    }
    if (this.current) {
      this.current.dispose();
    }
  }

  async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({
    title,
    step,
    totalSteps,
    items,
    activeItem,
    placeholder,
    buttons,
    onDidChangeActive,
    shouldResume,
  }: P) {
    const disposables: Disposable[] = [];
    try {
      return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
        const input = window.createQuickPick<T>();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.placeholder = placeholder;
        input.items = items;
        if (activeItem) {
          input.activeItems = [activeItem];
        }
        input.buttons = [...(this.steps.length > 1 ? [QuickInputButtons.Back] : []), ...(buttons || [])];
        disposables.push(
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              resolve(<any>item);
            }
          }),
          input.onDidChangeActive((items) => {
            input.placeholder = items[0].label;
            if (onDidChangeActive !== undefined) {
              onDidChangeActive(items[0]);
            }
          }),
          input.onDidChangeSelection((items) => resolve(items[0])),
          input.onDidHide(() => {
            (async () => {
              reject(shouldResume && (await shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
            })().catch(reject);
          }),
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }

  async showInputBox<P extends InputBoxParameters>({
    title,
    step,
    totalSteps,
    value,
    prompt,
    validate,
    buttons,
    shouldResume,
  }: P) {
    const disposables: Disposable[] = [];
    try {
      return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
        const input = window.createInputBox();
        input.title = title;
        input.step = step;
        input.totalSteps = totalSteps;
        input.value = value || '';
        input.prompt = prompt;
        input.buttons = [...(this.steps.length > 1 ? [QuickInputButtons.Back] : []), ...(buttons || [])];
        let validating = validate('');
        disposables.push(
          input.onDidTriggerButton((item) => {
            if (item === QuickInputButtons.Back) {
              reject(InputFlowAction.back);
            } else {
              resolve(<any>item);
            }
          }),
          input.onDidAccept(async () => {
            const value = input.value;
            input.enabled = false;
            input.busy = true;
            if (!(await validate(value))) {
              resolve(value);
            }
            input.enabled = true;
            input.busy = false;
          }),
          input.onDidChangeValue(async (text) => {
            const current = validate(text);
            validating = current;
            const validationMessage = await current;
            if (current === validating) {
              input.validationMessage = validationMessage;
            }
          }),
          input.onDidHide(() => {
            (async () => {
              reject(shouldResume && (await shouldResume()) ? InputFlowAction.resume : InputFlowAction.cancel);
            })().catch(reject);
          }),
        );
        if (this.current) {
          this.current.dispose();
        }
        this.current = input;
        this.current.show();
      });
    } finally {
      disposables.forEach((d) => d.dispose());
    }
  }
}
