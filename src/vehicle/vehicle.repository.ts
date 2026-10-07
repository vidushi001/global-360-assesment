import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { VehicleMakeDto } from './dto/vehicle.dto';

@Injectable()
export class VehicleRepository {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async saveVehicles(allVehicle: VehicleMakeDto[]): Promise<void> {
    // Save to MongoDB
    await this.vehicleModel.bulkWrite(
      allVehicle.map((vehicle) => ({
        updateOne: {
          filter: { makeId: vehicle.makeId },
          update: {
            $set: {
              makeName: vehicle.makeName,
              vehicleTypes: vehicle.vehicleTypes,
            },
          },
          upsert: true,
        },
      })),
    )
  }

  async findAll(makeId: number | null,makeName: string | null,typeName: string | null): Promise<Vehicle[]> {
    let query = {}
    if(makeId){
        query['makeId']=makeId
    }
    if(makeName){
        query['makeName']=makeName
    }
    if(typeName){
        query['vehicleTypes.typeName']=typeName
    }
    console.log("query",query)
    return this.vehicleModel.find(query).lean().exec();
  }

  async findByMakeId(makeId: number): Promise<Vehicle | null> {
    return this.vehicleModel.findOne({ makeId }).lean().exec();
  }
}