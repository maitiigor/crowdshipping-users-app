export interface IPickupByDriverResponse {
  code: number;
  message: string;
  data: IPickupByDriverData;
}

export interface IPickupByDriverData {
  id: string;
  amount: number;
  nearby_drivers: IPickupByDriverNearbyDriver[];
}

export interface IPickupByDriverNearbyDriver {
  _id: string;
  userId: string;
  profilePicUrl: string;
  rating: IPickupByDriverRating;
  gender: string;
  geoLocation: IPickupByDriverGeoLocation;
  user: IPickupByDriverUser;
  distanceInKm: number;
  minutesAway: number;
}

export interface IPickupByDriverGeoLocation {
  type: string;
  coordinates: number[];
  address: string;
}

export interface IPickupByDriverRating {
  avg: number;
  count: number;
}

export interface IPickupByDriverUser {
  _id: string;
  fullName: string;
}

// pickup details
export interface IPickupTripDetailsResponse {
  code: number;
  message: string;
  data: IPickupTripDetailsData;
}

export interface IPickupTripDetailsData {
  _id: string;
  trackingId: string;
  weight: number | string;
  pickUpLocation: IPickupTripDetailsLocation;
  dropOffLocation: IPickupTripDetailsLocation;
  bookingType: string;
  scheduleDate: string | null;
  sender: IPickupTripDetailsSender;
  driver: IPickupTripDetailsDriver;
  reciver: IPickupTripDetailsReceiver;
  packages: IPickupTripDetailsPackage[];
}

export interface IPickupTripDetailsLocation {
  lat: number;
  lon?: number;
  lng?: number;
  address: string;
}

export interface IPickupTripDetailsSender {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface IPickupTripDetailsDriver {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface IPickupTripDetailsReceiver {
  receiverName: string;
  receiverPhone: string;
  alternativePhone: string;
}

export interface IPickupTripDetailsPackage {
  _id: string;
  productCategory: string;
  productType: string;
  productWeight: number;
  productUnit: string;
  productImage: string;
  productDescription: string;
  id: string;
}
