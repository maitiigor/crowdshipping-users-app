export interface IUserPreferenceResponse {
  code: number;
  message: string;
  data: IUserPreferenceData;
}

export interface IUserPreferenceData {
  userId: string;
  enableEmail: boolean;
  enableSms: boolean;
  theme: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
