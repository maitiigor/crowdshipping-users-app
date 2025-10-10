export interface INotificationsResponse {
  code: number;
  message: string;
  data: INotificationsDatum[];
}

export interface INotificationsDatum {
  _id: string;
  userId: string;
  triggeredById: string;
  type: string;
  channel: string;
  title: string;
  message: string;
  data?: INotificationsData;
  isRead: boolean;
  delivered: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}



export interface INotificationsData {
  bidId?: string;
  parcelGroupId?: string;
  bookingId?: string;
  location?: INotificationsLocation;
  booking?: string;
  transactionId?: string;
  reportRef?: string;
  tripId?: string;
}

export interface INotificationsLocation {
  lat: number;
  lng: number;
  address: string;
  speed: number;
  heading: number;
  timestamp: string;
}

// single notification response
export interface ISingleNotificationResponse {
  code: number;
  message: string;
  data: INotificationsDatum;
}


