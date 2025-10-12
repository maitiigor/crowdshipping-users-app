export interface IReportResponse {
  code: number;
  message: string;
  data: IReportDatum[];
}

export interface IReportDatum {
  _id: string;
  reportRef: string;
  description: string;
  status: string;
  updatedAt: string;
}
// Single Report Response
export interface ISingleReportResponse {
  code: number;
  message: string;
  data: ISingleReportData;
}

export interface ISingleReportData {
  _id: string;
  reportRef: string;
  reportType: string;
  natureOfReport: string;
  reportAmount: number;
  description: string;
  raisedById: string;
  evidence: string;
  amountRefunded: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  supportTeam: null;
  raisedBy: ISingleReportRaisedBy;
}

export interface ISingleReportRaisedBy {
  _id: string;
  userId: string;
  fullName: string;
}
