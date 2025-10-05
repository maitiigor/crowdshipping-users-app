export interface IUserProfileResponse {
  code: number;
  message: string;
  data: IUserProfileData;
}

export interface IUserProfileData {
  _id: string;
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  status: string;
  deviceTokens: any[];
  profileId: string;
  walletId: string;
  profile: IUserProfileProfile;
  wallet: IUserProfileWallet;
}

export interface IUserProfileProfile {
  _id: string;
  language: string;
  profilePicUrl: string;
  country: string;
  city: string;
  state: string;
  rating: Rating;
  gender: string;
  address: string;
  lng: number;
  lat: number;
}

export interface Rating {
  avg: number;
  count: number;
}

export interface IUserProfileGeoLocation {
  address: string;
}

export interface IUserProfileWallet {
  _id: string;
  walletId: string;
  balance: number;
  availableBalance: number;
}
