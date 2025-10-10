export interface IWalletRequestResponse {
  code: number;
  message: string;
  data: IWalletRequestData;
}

export interface IWalletRequestData {
  wallet: IWalletRequestWallet;
  transactions: IWalletRequestTransaction[];
}

export interface IWalletRequestTransaction {
  type: string;
  title?: string;
  description: string;
  status: string;
  amount: number;
  purpose: string;
  referenceId: string;
  previousBalance: number;
  currentBalance: number;
}

export interface IWalletRequestWallet {
  status: string;
  availableBalance: number;
  accountName: string;
  accountNumber: number;
  bankName: string;
}
