export interface IBookingHistoryResponse {
  code: number;
  message: string;
  data: IBookingHistoryDatum[];
}

export interface IBookingHistoryDatum {
  _id: string;
  bookingRef: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingDetailsResponse {
  code: number;
  message: string;
  data: IBookingDetailsData;
}

export interface IBookingDetailsData {
  _id: string;
  bookingRef: string;
  travellerId: string;
  senderId: string;
  parcelGroupId: string;
  status: string;
  paymentStatus: string;
  trip: null;
  parcelGroup: IBookingDetailsParcelGroup;
  sender: IBookingDetailsSender;
  traveller: IBookingDetailsTraveller;
  parcels: IBookingDetailsParcel[];
}

export interface IBookingDetailsParcelGroup {
  _id: string;
  trackingId: string;
  pickUpLocation: IBookingDetailsLocation;
  dropOffLocation: IBookingDetailsLocation;
  alternativePhone: string;
  receiverName: string;
  receiverPhone: string;
}

export interface IBookingDetailsLocation {
  address: string;
}

export interface IBookingDetailsParcel {
  _id: string;
  productType: string;
  productWeight: number;
  productUnit: string;
  productImage: string;
}

export interface IBookingDetailsSender {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: IBookingDetailsProfile;
}

export interface IBookingDetailsProfile {
  _id: string;
  profilePicUrl: string;
  country: string;
  city: string;
  state: string;
  gender: string;
  geoLocation: IBookingDetailsLocation;
}
export interface IBookingDetailsTraveller {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: IBookingDetailsProfile;
}
