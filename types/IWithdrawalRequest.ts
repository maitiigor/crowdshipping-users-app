export interface IWithdrawalRequestResponse {
  code: number;
  message: string;
  data: IWithdrawalRequestDatum[];
}

export interface IWithdrawalRequestDatum {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: IWithdrawalRequestGateway | null;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  available_for_direct_debit: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum IWithdrawalRequestGateway {
  Digitalbankmandate = "digitalbankmandate",
  Emandate = "emandate",
  Empty = "",
  Ibank = "ibank",
  Null = "null",
}
