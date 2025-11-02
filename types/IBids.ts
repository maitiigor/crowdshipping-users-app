export interface IBidTripsResponse {
  code: number;
  message: string;
  data: IBidTripsDatum[];
}

export interface IBidTripsDatum {
  _id: string;
  bidId: string;
  parcelGroupId: string;
  bidderId: string;
  amount: number;
  currency: string;
  bidder: IBidTripsBidder;
  parcelGroup: IBidTripsParcelGroup;
}

export interface IBidTripsBidder {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: IBidTripsProfile;
}

export interface IBidTripsProfile {
  _id: string;
  profilePicUrl: string;
  country: string;
  city: string;
  state: string;
  gender: string;
  geoLocation: IBidTripsLocation;
}

export interface IBidTripsLocation {
  address: string;
}

export interface IBidTripsParcelGroup {
  _id: string;
  trackingId: string;
  tripId: string;
  weight: number;
  pickUpLocation: IBidTripsLocation;
  dropOffLocation: IBidTripsLocation;
  status: string;
  trip: IBidTripsTrip;
}

export interface IBidTripsTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: IBidTripsBidder;
}

// single bid details response for air and sea
export interface ISingleBidDetailsResponse {
  code: number;
  message: string;
  data: ISingleBidDetailsData;
}

export interface ISingleBidDetailsData {
  _id: string;
  bidId: string;
  parcelGroupId: string;
  bidderId: string;
  amount: number;
  currency: string;
  bidder: ISingleBidDetailsBidder;
  parcelGroup: ISingleBidDetailsParcelGroup;
}

export interface ISingleBidDetailsBidder {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: ISingleBidDetailsProfile;
}

export interface ISingleBidDetailsProfile {
  _id: string;
  profilePicUrl: null | string;
  country: null | string;
  address: null | string;
  city: null | string;
  state: null | string;
  gender?: string;
  geoLocation?: ISingleBidDetailsLocation;
}

export interface ISingleBidDetailsParcelGroup {
  _id: string;
  trackingId: string;
  tripId: string;
  weight: number;
  pickUpLocation: ISingleBidDetailsLocation;
  dropOffLocation: ISingleBidDetailsLocation;
  status: string;
  trip: ISingleBidDetailsTrip;
}

export interface ISingleBidDetailsLocation {
  address: string;
}

export interface ISingleBidDetailsTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: ISingleBidDetailsBidder;
}

// maritime bidding
