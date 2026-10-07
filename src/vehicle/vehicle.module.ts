import { Module } from '@nestjs/common';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';
import {VehicleRepository} from './vehicle.repository'
@Module({
  imports:[MongooseModule.forFeature([
        {
          name: Vehicle.name,
          schema: VehicleSchema,
        },
      ])],
  controllers: [VehicleController],
  providers: [VehicleService,VehicleRepository],
   exports: [
    VehicleRepository,
  ],
})
export class VehicleModule {}
