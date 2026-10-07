export class VehicleTypeDto {
  typeId!: number;
  typeName!: string;
}

export class VehicleMakeDto {
  makeId!: number;
  makeName!: string;
  vehicleTypes!: VehicleTypeDto[];
}