export interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  currency: string;
  balance: number;
}

export interface ConversionRate {
  from: string;
  to: string;
  rate: number;
}

export interface ConversionRequest {
  fromAccountId: string;
  toAccountId: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
}

export interface ConversionResult {
  success: boolean;
  message: string;
  updatedFromAccount?: Account;
  updatedToAccount?: Account;
}