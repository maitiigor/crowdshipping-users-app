export interface ISeaMaritimeResponse {
  code: number;
  message: string;
  data: ISeaMaritimeDatum[];
}

export interface ISeaMaritimeDatum {
  _id: string;
  mmsiNumber: string;
  vesselName: string;
  vesselOperator: string;
  containerNumber: string;
  departurePort: string;
  arrivalPort: string;
  voyageNumber: string;
  tripId: string;
  trip: ISeaMaritimeTrip;
}

export interface ISeaMaritimeTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: ISeaMaritimeCreator;
}

export interface ISeaMaritimeCreator {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: ISeaMaritimeProfile;
}

export interface ISeaMaritimeProfile {
  _id: string;
  profilePicUrl: null;
  country: string;
  address: string;
  city: string;
  state: string;
  gender: string;
}

// single sea maritime response
export interface ISingleSeaMaritimeResponse {
  code: number;
  message: string;
  data: ISingleSeaMaritimeData;
}

export interface ISingleSeaMaritimeData {
  _id: string;
  mmsiNumber: string;
  vesselName: string;
  vesselOperator: string;
  containerNumber: string;
  departurePort: string;
  arrivalPort: string;
  voyageNumber: string;
  tripId: string;
  trip: ISingleSeaMaritimeTrip;
}

export interface ISingleSeaMaritimeTrip {
  _id: string;
  tripId: string;
  creatorId: string;
  status: string;
  departureDate: string;
  arrivalDate: string;
  creator: ISingleSeaMaritimeCreator;
}

export interface ISingleSeaMaritimeCreator {
  _id: string;
  userId: string;
  fullName: string;
  profileId: string;
  profile: ISingleSeaMaritimeProfile;
}

export interface ISingleSeaMaritimeProfile {
  _id: string;
  profilePicUrl: null;
  country: string;
  address: string;
  city: string;
  state: string;
  gender: string;
}
