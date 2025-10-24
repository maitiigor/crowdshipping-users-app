export interface IAirTripResponse {
  code: number;
  message: string;
  data: IAirTripDatum[];
}

export interface IAirTripDatum {
  _id: string;
  departureCity: string;
  arrivalCity: string;
  airlineName: string;
  flightNumber: string;
  tripId: string;
  trip: IAirTripTrip;
}

export interface IAirTripTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: IAirTripCreator;
}

export interface IAirTripCreator {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: IAirTripProfile;
}

export interface IAirTripProfile {
  _id: string;
  profilePicUrl: null;
  country: string;
  address: string;
  city: string;
  state: string;
  gender: string;
}

// single air trip response
export interface ISingleAirTripResponse {
  code: number;
  message: string;
  data: ISingleAirTripData;
}

export interface ISingleAirTripData {
  _id: string;
  departureCity: string;
  arrivalCity: string;
  airlineName: string;
  flightNumber: string;
  tripId: string;
  trip: ISingleAirTripTrip;
}

export interface ISingleAirTripTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: ISingleAirTripCreator;
}

export interface ISingleAirTripCreator {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: ISingleAirTripProfile;
}

export interface ISingleAirTripProfile {
  _id: string;
  profilePicUrl: null;
  country: string;
  address: string;
  city: string;
  state: string;
  gender: string;
}
