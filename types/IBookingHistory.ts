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

// active bookings response types
export interface IActiveBookingsResponse {
  code: number;
  message: string;
  data: IActiveBookingsDatum[];
}

export interface IActiveBookingsDatum {
  _id: string;
  bookingRef: string;
  status: "GOING_TO_PICKUP"
  | "PICKED_UP"
  | "IN_TRANSIT"
  | "ARRIVED_DESTINATION"
  | "DELIVERED"
  | "TOLL_BILL_PENDING"
  | "COMPLETED"
  | "IN_PROGRESS";
  paymentStatus: string;
  fleetType?: string;
  createdAt: string;
  updatedAt: string;
  last_location: IActiveBookingsLastLocation | null;
}

export interface IActiveBookingsLastLocation {
  _id: string;
  coords: IActiveBookingsCoords;
  speed: number;
  heading: number;
  createdAt: string;
}

export interface IActiveBookingsCoords {
  type: string;
  coordinates: number[];
  address: string;
}

// ongoing trips response types
export interface ILiveTrackingResponse {
  code: number;
  message: string;
  data: ILiveTrackingData;
}

export interface ILiveTrackingData {
  _id: string;
  bookingRef: string;
  travellerId: string;
  senderId: string;
  status: string;
  fleetType: string;
  createdAt: string;
  updatedAt: string;
  sender: ILiveTrackingSender;
  traveller: ILiveTrackingSender;
  locations: ILiveTrackingLocation[];
}

export interface ILiveTrackingLocation {
  _id: string;
  coords: ILiveTrackingCoords;
  speed: number;
  heading: number;
  createdAt: string;
}

export interface ILiveTrackingCoords {
  type: string;
  coordinates: number[];
  address: string;
}

export interface ILiveTrackingSender {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: ILiveTrackingProfile;
}

export interface ILiveTrackingProfile {
  _id: string;
  profilePicUrl: string;
  gender: string;
}
