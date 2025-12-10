import { Injectable } from '@angular/core';
import {
  Account,
  ConversionRate,
  ConversionRequest,
  ConversionResult,
} from '../model/account.interface';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  map,
  Observable,
  of,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl: string = 'http://localhost:3000';
  private readonly senderAccountsSubject: BehaviorSubject<Account[]> =
    new BehaviorSubject<Account[]>([])
  private readonly receiverAccountsSubject: BehaviorSubject<Account[]> =
    new BehaviorSubject<Account[]>([])
  public readonly senderAccounts$: Observable<Account[]> =
    this.senderAccountsSubject.asObservable();
  public readonly receiverAccounts$: Observable<Account[]> =
    this.receiverAccountsSubject.asObservable();

  constructor(private readonly httpClient: HttpClient) {}

  public loadSenderAccounts(): void {
    this.httpClient
      .get<Account[]>(`${this.apiUrl}/sender-accounts`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('errorsender account', error);
          return of([]);
        })
      )
      .subscribe((accounts: Account[]) => {
        this.senderAccountsSubject.next(accounts);
      });
  }

  public loadReceiverAccounts(): void {
    this.httpClient
      .get<Account[]>(`${this.apiUrl}/receiver-accounts`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error loading receiver accounts:', error);
          return of([]);
        })
      )
      .subscribe((accounts: Account[]) => {
        this.receiverAccountsSubject.next(accounts);
      });
  }

  public getConversionRate(
    fromCurrency: string,
    toCurrency: string
  ): Observable<number | null> {
    return this.httpClient
      .get<ConversionRate[]>(`${this.apiUrl}/conversion-rates`)
      .pipe(
        map((rates: ConversionRate[]) => {
          const rate: ConversionRate | undefined = rates.find(
            (r: ConversionRate) =>
              r.from === fromCurrency && r.to === toCurrency
          );
          return rate ? rate.rate : null;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('error-conversation rrate', error)
          return of(null);
        })
      );
  }

  public performConversion(request: ConversionRequest): Observable<ConversionResult> {
    const senderAccounts: Account[] = this.senderAccountsSubject.value;
    const receiverAccounts: Account[] = this.receiverAccountsSubject.value;

    const fromAccount: Account | undefined = senderAccounts.find(
      (account: Account) => account.id === request.fromAccountId
    );
    const toAccount: Account | undefined = receiverAccounts.find(
      (account: Account) => account.id === request.toAccountId
    );

    if (!fromAccount) {
      return of({
        success: false,
        message: 'origin account not found',
      });
    }

    if (!toAccount) {
      return of({
        success: false,
        message: 'destination account not found',
      });
    }

    if (fromAccount.balance < request.fromAmount) {
      return of({
        success: false,
        message: 'insufficient balance',
      });
    }

    if (request.fromAmount <= 0) {
      return of({
        success: false,
        message: 'amount must be greater than zero',
      });
    }

    const updatedFromAccount: Account = {
      ...fromAccount,
      balance: this.roundToTwoDecimals(
        fromAccount.balance - request.fromAmount
      ),
    };

    const updatedToAccount: Account = {
      ...toAccount,
      balance: this.roundToTwoDecimals(toAccount.balance + request.toAmount),
    };

    return forkJoin({
      fromAcc: this.httpClient.put<Account>(
        `${this.apiUrl}/sender-accounts/${fromAccount.id}`,
        updatedFromAccount
      ),
      toAcc: this.httpClient.put<Account>(
        `${this.apiUrl}/receiver-accounts/${toAccount.id}`,
        updatedToAccount
      ),
    }).pipe(
      map(() => {
        const updatedSenders: Account[] = senderAccounts.map(
          (account: Account) =>
            account.id === updatedFromAccount.id ? updatedFromAccount : account
        );
        const updatedReceivers: Account[] = receiverAccounts.map(
          (account: Account) =>
            account.id === updatedToAccount.id ? updatedToAccount : account
        );

        this.senderAccountsSubject.next(updatedSenders);
        this.receiverAccountsSubject.next(updatedReceivers);

        const result: ConversionResult = {
          success: true,
          message: 'successful',
          updatedFromAccount: updatedFromAccount,
          updatedToAccount: updatedToAccount,
        };

        return result;
      }),
      catchError((error: HttpErrorResponse) => {
        console.log(error, "error")
        const result: ConversionResult = {
          success: false,
          message: 'conversion failed',
        };
        return of(result);
      })
    );
  }

  public getSenderAccountById(accountId: string): Account | undefined {
    return this.senderAccountsSubject.value.find(
      (account: Account) => account.id === accountId
    )
  }

  public getReceiverAccountById(accountId: string): Account | undefined {
    return this.receiverAccountsSubject.value.find(
      (account: Account) => account.id === accountId
    );
  }

  private roundToTwoDecimals(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
