import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import {
  Account,
  ConversionRequest,
  ConversionResult,
} from 'src/app/model/account.interface';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
})
export class CurrencyComponent implements OnInit, OnDestroy {
public senderAccounts: Account[] = [];
  public receiverAccounts: Account[] = [];
  public conversionForm!: FormGroup;
  public conversionRate: number | null = null;
  public isLoadingRate: boolean = false;
  public balanceError: string = '';
  public conversionSuccess: string = '';
  public conversionError: string = '';
  public isConverting: boolean = false;
  public hoveredAccountId: string = '';
  public showAmountSection: boolean = false;
  public showRateDisplay: boolean = false;
  public showBalancesSection: boolean = false;
  public selectedFromAccount: Account | null = null
  public selectedToAccount: Account | null = null;
  public fromAccountValidationError: string = '';
  public toAccountValidationError: string = ''
  public fromAmountValidationError: string = '';
  public toAmountValidationError: string = '';
  public disabledFromAccounts: Set<string> = new Set()
  public disabledToAccounts: Set<string> = new Set()
  public fromAccountTooltips: Map<string, string> = new Map();
  public toAccountTooltips: Map<string, string> = new Map();
  private readonly destroy$: Subject<void> = new Subject<void>();
  private isUpdatingFromAmount: boolean = false;
  private isUpdatingToAmount: boolean = false
  private readonly DEBOUNCE_TIME: number = 300;
  private readonly MIN_AMOUNT: number = 0.01;
  private readonly DECIMAL_PLACES: number = 2;

  constructor(
    private readonly accountService: AccountService,
    private readonly fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAccounts();
    this.setupFormListeners();
    this.setupPersistence();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.conversionForm = this.fb.group({
      fromAccountId: ['', [Validators.required]],
      toAccountId: ['', [Validators.required]],
      fromAmount: ['', [Validators.required, Validators.min(this.MIN_AMOUNT)]],
      toAmount: ['', [Validators.required, Validators.min(this.MIN_AMOUNT)]],
    });
  }

  private loadAccounts(): void {
    this.accountService.loadSenderAccounts()
    this.accountService.loadReceiverAccounts()
    this.accountService.senderAccounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.senderAccounts = accounts;
        this.updateDisabledAccountsAndTooltips();
      });

    this.accountService.receiverAccounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe((accounts: Account[]) => {
        this.receiverAccounts = accounts;
        this.updateDisabledAccountsAndTooltips();
      });
  }

  private setupFormListeners(): void {
    const fromAccountIdControl: AbstractControl | null =
      this.conversionForm.get('fromAccountId')
    const toAccountIdControl: AbstractControl | null =
      this.conversionForm.get('toAccountId')
    const fromAmountControl: AbstractControl | null =
      this.conversionForm.get('fromAmount');
    const toAmountControl: AbstractControl | null =
      this.conversionForm.get('toAmount');

    if (fromAccountIdControl) {
      fromAccountIdControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: string) => {
          this.onFromAccountChange(value);
        });
    }

    if (toAccountIdControl) {
      toAccountIdControl.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: string) => {
          this.onToAccountChange(value)
        });
    }

    if (fromAmountControl) {
      fromAmountControl.valueChanges
        .pipe(
          debounceTime(this.DEBOUNCE_TIME),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((value: string) => {
          if (!this.isUpdatingFromAmount) {
            this.onFromAmountChange(value);
          }
        });
    }

    if (toAmountControl) {
      toAmountControl.valueChanges
        .pipe(
          debounceTime(this.DEBOUNCE_TIME),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((value: string) => {
          if (!this.isUpdatingToAmount) {
            this.onToAmountChange(value);
          }
        });
    }
  }

  private setupPersistence(): void {
    this.accountService.senderAccounts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadSavedForm());

    this.conversionForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => this.saveForm());
  }

  private loadSavedForm(): void {
    const saved = localStorage.getItem('form');
    if (saved) {
      this.conversionForm.patchValue(JSON.parse(saved));
    }
  }

  private saveForm(): void {
    localStorage.setItem('form', JSON.stringify(this.conversionForm.value));
  }

  private onFromAccountChange(accountId: string): void {
    this.clearMessages();
    this.updateSelectedAccounts();
    this.updateDisabledAccountsAndTooltips()
    this.updateValidationErrors();
    this.updateVisibilityStates()

    if (this.shouldLoadConversionRate()) {
      this.loadConversionRate();
    } else {
      this.resetAmounts();
    }
  }

  private onToAccountChange(accountId: string): void {
    this.clearMessages();
    this.updateSelectedAccounts();
    this.updateDisabledAccountsAndTooltips();
    this.updateValidationErrors()
    this.updateVisibilityStates()

    if (this.shouldLoadConversionRate()) {
      this.loadConversionRate();
    } else {
      this.resetAmounts();
    }
  }

  private shouldLoadConversionRate(): boolean {
    const fromAccountId: string = this.getFormValue('fromAccountId');
    const toAccountId: string = this.getFormValue('toAccountId');
    return !!fromAccountId && !!toAccountId;
  }

  private loadConversionRate(): void {
    if (!this.selectedFromAccount || !this.selectedToAccount) {
      return
    }
    this.isLoadingRate=true;
    this.isLoadingRate = true;
    this.conversionRate = null;

    this.accountService
      .getConversionRate(
        this.selectedFromAccount.currency,
        this.selectedToAccount.currency
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rate: number | null) => {
          this.isLoadingRate = false;
          this.conversionRate = rate;
          this.updateVisibilityStates();

          const fromAmount: string = this.getFormValue('fromAmount');
          const toAmount: string = this.getFormValue('toAmount');

          if (fromAmount && rate) {
            this.calculateToAmount(fromAmount);
          } else if (toAmount && rate) {
            this.calculateFromAmount(toAmount);
          }
        },
        error: (error: Error) => {
          this.isLoadingRate = false;
          this.conversionError = 'error to load conversion rate';
          console.error('error', error);
        },
      });
  }

  private onFromAmountChange(value: string): void {
    this.clearMessages();
    this.updateValidationErrors();

    if (!value || value === '' || value === '0') {
      this.clearToAmount();
      this.validateBalance();
      return;
    }

    this.calculateToAmount(value);
    this.validateBalance();
  }

  private onToAmountChange(value: string): void {
    this.clearMessages();
    this.updateValidationErrors();

    if (!value || value === '' || value === '0') {
      this.clearFromAmount();
      return;
    }

    this.calculateFromAmount(value);
    this.validateBalance();
  }

  private calculateToAmount(fromAmountStr: string): void {
    if (!this.conversionRate || !fromAmountStr) {
      return;
    }

    const fromAmountNumber: number = parseFloat(fromAmountStr);

    if (isNaN(fromAmountNumber) || fromAmountNumber <= 0) {
      this.clearToAmount();
      return;
    }

    const calculatedToAmount: number = fromAmountNumber * this.conversionRate;
    const formattedAmount: string = this.formatAmount(calculatedToAmount);

    this.isUpdatingToAmount = true
    this.setFormValue('toAmount', formattedAmount);
    this.isUpdatingToAmount = false;
  }

  private calculateFromAmount(toAmountStr: string): void {
    if (!this.conversionRate || !toAmountStr) {
      return
    }

    const toAmountNumber: number = parseFloat(toAmountStr);

    if (isNaN(toAmountNumber) || toAmountNumber <= 0) {
      this.clearFromAmount()
      return;
    }

    const calculatedFromAmount: number = toAmountNumber / this.conversionRate;
    const formattedAmount: string = this.formatAmount(calculatedFromAmount);

    this.isUpdatingFromAmount = true
    this.setFormValue('fromAmount', formattedAmount);
    this.isUpdatingFromAmount = false;
    this.validateBalance();
  }

  private validateBalance(): void {
    this.balanceError = ''

    const fromAmount: string = this.getFormValue('fromAmount');

    if (!fromAmount || !this.selectedFromAccount) {
      return;
    }

    const fromAmountNumber: number = parseFloat(fromAmount);

    if (isNaN(fromAmountNumber)) {
      return;
    }

    if (fromAmountNumber > this.selectedFromAccount.balance) {
      this.balanceError = `თანხა არ არის საკმარისი: ${this.selectedFromAccount.balance} ${this.selectedFromAccount.currency}`;
    }
  }

  private formatAmount(amount: number): string {
    return amount.toFixed(this.DECIMAL_PLACES);
  }

  private updateDisabledAccountsAndTooltips(): void {
    this.updateDisabledFromAccounts()
    this.updateDisabledToAccounts()
    this.updateFromAccountTooltips();
    this.updateToAccountTooltips();
  }

  private updateDisabledFromAccounts(): void {
    this.disabledFromAccounts.clear();
    const toAccountId: string = this.getFormValue('toAccountId');

    if (toAccountId) {
      this.disabledFromAccounts.add(toAccountId);
    }
  }

private updateDisabledToAccounts(): void {
  this.disabledToAccounts.clear()
  const fromAccountId: string = this.getFormValue('fromAccountId');

  if (!fromAccountId) {
    return;
  }

  this.disabledToAccounts.add(fromAccountId);

  if (this.selectedFromAccount) {
    this.receiverAccounts.forEach((account: Account) => {
      if (account.currency === this.selectedFromAccount!.currency) {
        this.disabledToAccounts.add(account.id);
      }
    });
  }
}

  private updateFromAccountTooltips(): void {
    this.fromAccountTooltips.clear();
    const toAccountId: string = this.getFormValue('toAccountId');

    if (toAccountId) {
      this.fromAccountTooltips.set(
        toAccountId,
        'account is already selected on second account'
      );
    }
  }

private updateToAccountTooltips(): void {
  this.toAccountTooltips.clear();
  const fromAccountId: string = this.getFormValue('fromAccountId');

  if (!fromAccountId || !this.selectedFromAccount) {
    return
  }

  this.toAccountTooltips.set(
    fromAccountId,
    'account is already selected on first account'
  );

  this.receiverAccounts.forEach((account: Account) => {
    if (account.currency === this.selectedFromAccount!.currency && account.id !== fromAccountId) {
      this.toAccountTooltips.set(
        account.id,
        `ეს ანგარიში შეესაბამება (${this.selectedFromAccount!.currency}) -ს, აირჩიეთ სხვა ექაუნთი`
      );
    }
  });
}
  private updateSelectedAccounts(): void {
    const fromAccountId: string = this.getFormValue('fromAccountId');
    const toAccountId: string = this.getFormValue('toAccountId');

    this.selectedFromAccount = fromAccountId
      ? this.accountService.getSenderAccountById(fromAccountId) || null
      : null;

    this.selectedToAccount = toAccountId
      ? this.accountService.getReceiverAccountById(toAccountId) || null
      : null;
  }

  private updateValidationErrors(): void {
    this.updateFromAccountValidationError();
    this.updateToAccountValidationError();
    this.updateFromAmountValidationError();
    this.updateToAmountValidationError();
  }

  private updateFromAccountValidationError(): void {
    const control: AbstractControl | null =
      this.conversionForm.get('fromAccountId');
    this.fromAccountValidationError = '';

    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        this.fromAccountValidationError = 'გთხოვთ აირჩიოთ ანგარიში 1';
      }
    }
  }

  private updateToAccountValidationError(): void {
    const control: AbstractControl | null =
      this.conversionForm.get('toAccountId');
    this.toAccountValidationError = '';

    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        this.toAccountValidationError = 'გთხოვთ აირჩიოთ ანგარიში 2';
      }
    }
  }

  private updateFromAmountValidationError(): void {
    const control: AbstractControl | null =
      this.conversionForm.get('fromAmount');
    this.fromAmountValidationError = '';

    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        this.fromAmountValidationError = 'თანხის შეყვანა სავალდებულოა';
      } else if (control.errors?.['min']) {
        this.fromAmountValidationError = 'თანხა უნდა იყოს 0-ზე მეტი';
      }
    }
  }

  private updateToAmountValidationError(): void {
    const control: AbstractControl | null = this.conversionForm.get('toAmount');
    this.toAmountValidationError = '';

    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        this.toAmountValidationError = 'თანხის შეყვანა სავალდებულოა';
      } else if (control.errors?.['min']) {
        this.toAmountValidationError = 'თანხა უნდა იყოს 0-ზე მეტი';
      }
    }
  }

  private updateVisibilityStates(): void {
    const fromAccountId: string = this.getFormValue('fromAccountId');
    const toAccountId: string = this.getFormValue('toAccountId');

    this.showRateDisplay =
      !!this.conversionRate && !!fromAccountId && !!toAccountId;
    this.showAmountSection =
      !!fromAccountId && !!toAccountId && !!this.conversionRate;
    this.showBalancesSection = !!fromAccountId || !!toAccountId;
  }

  public isAccountDisabled(accountId: string, isFromAccount: boolean): boolean {
    if (isFromAccount) {
      return this.disabledFromAccounts.has(accountId);
    } else {
      return this.disabledToAccounts.has(accountId);
    }
  }

  public getAccountTooltip(accountId: string, isFromAccount: boolean): string {
    if (isFromAccount) {
      return this.fromAccountTooltips.get(accountId) || '';
    } else {
      return this.toAccountTooltips.get(accountId) || '';
    }
  }

  public shouldShowTooltipForAccount(
    accountId: string,
    isFromAccount: boolean
  ): boolean {
    return (
      this.hoveredAccountId === accountId &&
      this.isAccountDisabled(accountId, isFromAccount)
    );
  }

  public getConvertButtonDisabledState(): boolean {
    if (!this.conversionForm.valid) {
      return true;
    }

    if (!this.conversionRate) {
      return true;
    }

    if (this.balanceError) {
      return true;
    }

    if (!this.selectedFromAccount || !this.selectedToAccount) {
      return true;
    }

    if (this.selectedFromAccount.currency === this.selectedToAccount.currency) {
      return true;
    }

    if (this.isConverting) {
      return true;
    }

    return false;
  }

  public onConvert(): void {
    if (this.getConvertButtonDisabledState()) {
      return;
    }

    this.clearMessages();
    this.isConverting = true;

    const fromAmount: string = this.getFormValue('fromAmount');
    const toAmount: string = this.getFormValue('toAmount');
    const fromAccountId: string = this.getFormValue('fromAccountId');
    const toAccountId: string = this.getFormValue('toAccountId');

    const request: ConversionRequest = {
      fromAccountId: fromAccountId,
      toAccountId: toAccountId,
      fromAmount: parseFloat(fromAmount),
      toAmount: parseFloat(toAmount),
      rate: this.conversionRate!,
    };

    this.accountService
      .performConversion(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: ConversionResult) => {
          this.isConverting = false;

          if (result.success) {
            const fromCurrency: string =
              result.updatedFromAccount?.currency || '';
            const toCurrency: string = result.updatedToAccount?.currency || '';
            this.conversionSuccess = `წარმატებით დაკონვერტირდა ${fromAmount} ${fromCurrency} - ${toAmount} ${toCurrency}`;
            this.resetFormAmounts();
            this.updateSelectedAccounts();
          } else {
            this.conversionError = result.message;
          }
        },
        error: (error: Error) => {
          this.isConverting = false;
          this.conversionError = 'გთხოვთ თავიდან სცადეთ';
          console.error('error', error);
        },
      });
  }

  private resetFormAmounts(): void {
    this.setFormValue('fromAmount', '');
    this.setFormValue('toAmount', '');
  }

  private resetAmounts(): void {
    this.setFormValue('fromAmount', '');
    this.setFormValue('toAmount', '');
    this.conversionRate = null;
    this.updateVisibilityStates();
  }

  private clearFromAmount(): void {
    this.isUpdatingFromAmount = true;
    this.setFormValue('fromAmount', '');
    this.isUpdatingFromAmount = false;
  }

  private clearToAmount(): void {
    this.isUpdatingToAmount = true;
    this.setFormValue('toAmount', '');
    this.isUpdatingToAmount = false;
  }

  private clearMessages(): void {
    this.balanceError = '';
    this.conversionSuccess = '';
    this.conversionError = '';
  }

  public getAccountDisplayName(account: Account): string {
    return `${account.accountName} (${account.currency}) - ${account.balance}`;
  }

  public onMouseEnter(accountId: string): void {
    this.hoveredAccountId = accountId;
  }

  public onMouseLeave(): void {
    this.hoveredAccountId = '';
  }

  private getFormValue(controlName: string): string {
    const control: AbstractControl | null =
      this.conversionForm.get(controlName);
    return control?.value || '';
  }

  private setFormValue(controlName: string, value: string): void {
    const control: AbstractControl | null =
      this.conversionForm.get(controlName);
    if (control) {
      control.patchValue(value, { emitEvent: false });
    }
  }

  public getConvertButtonText(): string {
    return this.isConverting ? 'მიმდინარეობს გადარიცხვა' : 'გადარიცხვა';
  }

  public getRateDisplayText(): string {
    if (
      !this.selectedFromAccount ||
      !this.selectedToAccount ||
      !this.conversionRate
    ) {
      return '';
    }
    return `გაცვლითი კურსი 1 ${this.selectedFromAccount.currency} = ${this.conversionRate} ${this.selectedToAccount.currency}`;
  }

  public getLoadingRateText(): string {
    return 'მიმდინარეობს კურსის ჩატვირთვა';
  }
}
