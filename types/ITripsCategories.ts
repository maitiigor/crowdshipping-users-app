export interface IVehicleCategoriesResponse {
  code: number;
  message: string;
  data: IVehicleCategoriesDatum[];
}

export interface IVehicleCategoriesDatum {
  _id: string;
  name: string;
  description: string;
}
