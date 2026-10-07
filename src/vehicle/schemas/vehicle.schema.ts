import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({ _id: false })
export class VehicleType {
  @Prop({ required: true })
  typeId!: number;

  @Prop({ required: true })
  typeName!: string;
}

export const VehicleTypeSchema =
  SchemaFactory.createForClass(VehicleType);

@Schema({ timestamps: true })
export class Vehicle {
  @Prop({ required: true, unique: true })
  makeId!: number;

  @Prop({ required: true })
  makeName!: string;

  @Prop({
    type: [VehicleTypeSchema],
    required: true,
    default: [],
  })
  vehicleTypes!: VehicleType[];
}

export const VehicleSchema =
  SchemaFactory.createForClass(Vehicle);