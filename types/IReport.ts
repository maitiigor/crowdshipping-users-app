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

// claim response
export interface IClaimResponse {
  code: number;
  message: string;
  data: IClaimDatum[];
}

export interface IClaimDatum {
  _id: string;
  claimRef: string;
  description: string;
  status: string;
  updatedAt: string;
}

// Single Claim Response
export interface ISingleClaimResponse {
  code: number;
  message: string;
  data: ISingleClaimData;
}

export interface ISingleClaimData {
  _id: string;
  claimRef: string;
  description: string;
  raisedById: string;
  claimAmount: number;
  natureOfClaim: string;
  evidence: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  supportTeam: null;
  raisedBy: ISingleClaimRaisedBy;
}

export interface ISingleClaimRaisedBy {
  _id: string;
  userId: string;
  fullName: string;
}
