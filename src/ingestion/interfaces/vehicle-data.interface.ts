export interface VehicleMake {
  makeId: number;
  makeName: string;
  vehicleTypes: VehicleType[];
}

export interface VehicleType {
  typeId: number;
  typeName: string;
}