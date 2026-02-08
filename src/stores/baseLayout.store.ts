import { makeAutoObservable } from 'mobx';

export class BaseLayoutStore {
  warningMessage: string = '';
  isWarningVisible: boolean = false;
  successMessage: string = '';
  isSuccessVisible: boolean = false;
  private hideWarningTimeout: ReturnType<typeof setTimeout> | null = null;
  private hideSuccessTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  showWarning(message: string, duration: number = 3000) {
    if (this.hideWarningTimeout) {
      clearTimeout(this.hideWarningTimeout);
    }

    this.warningMessage = message;
    this.isWarningVisible = true;

    this.hideWarningTimeout = setTimeout(() => {
      this.hideWarning();
    }, duration);
  }

  hideWarning() {
    this.isWarningVisible = false;
    this.hideWarningTimeout = null;
  }

  showSuccess(message: string, duration: number = 3000) {
    if (this.hideSuccessTimeout) {
      clearTimeout(this.hideSuccessTimeout);
    }

    this.successMessage = message;
    this.isSuccessVisible = true;

    this.hideSuccessTimeout = setTimeout(() => {
      this.hideSuccess();
    }, duration);
  }

  hideSuccess() {
    this.isSuccessVisible = false;
    this.hideSuccessTimeout = null;
  }
}

export const baseLayoutStore = new BaseLayoutStore();
