import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class VehicleType {
  @Field(() => Int)
  typeId!: number;

  @Field()
  typeName!: string;
}

@ObjectType()
export class Vehicle {
  @Field(() => Int)
  makeId!: number;

  @Field()
  makeName!: string;

  @Field(() => [VehicleType])
  vehicleTypes!: VehicleType[];
}