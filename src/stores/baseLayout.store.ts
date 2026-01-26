import { makeAutoObservable } from 'mobx';

export class BaseLayoutStore {
  warningMessage: string = '';
  isWarningVisible: boolean = false;
  private hideTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  showWarning(message: string, duration: number = 3000) {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.warningMessage = message;
    this.isWarningVisible = true;

    this.hideTimeout = setTimeout(() => {
      this.hideWarning();
    }, duration);
  }

  hideWarning() {
    this.isWarningVisible = false;
    this.hideTimeout = null;
  }
}

export const baseLayoutStore = new BaseLayoutStore();
