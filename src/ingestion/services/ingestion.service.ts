import { Injectable } from '@nestjs/common';
import { NhtsaService } from './nhtsa.service';
import { TransformationService } from './transformation.service';
import {
  VehicleMakeDto,
  VehicleTypeDto,
} from '../dto/ingestion-result.dto';
import {VehicleRepository} from '../../vehicle/vehicle.repository'

@Injectable()
export class IngestionService {
    constructor(private readonly NhtsaService: NhtsaService,
              private readonly TransformationService: TransformationService,
              private readonly VehicleRepository: VehicleRepository,
              
        ) {}

    async getVehicles(): Promise<VehicleMakeDto[]> {
    // 1. Get all vehicle makes
    const makesResponse =
      await this.NhtsaService.getVehicleData();
      const batchSize = 10;
      const count = 10//makesResponse['Response']['Results']['AllVehicleMakes'].length;
      console.log("count",count)
      const totalMakeCall = [...makesResponse['Response']['Results']['AllVehicleMakes']]
      totalMakeCall.length = 10
      console.log("totalMakeCall",totalMakeCall)
      const loopCount = Math.ceil(count / batchSize);
      const allVehicle: VehicleMakeDto[] = [];
     for (let i = 0; i < loopCount; i++) {
         const start = i * batchSize;
         const end = start + batchSize;
        const batch = totalMakeCall.slice(i, end);
        // 2. Convert makes response
        const makes =
        this.TransformationService.transformMakes(batch);
        // // 3. Get vehicle types for every make
        const vehicles = await Promise.all(
        makes.map(async (make) => {
            const typesResponse =
            await this.NhtsaService.getVehicleTypes(
                make.makeId,
            );
            const vehicleTypes:VehicleTypeDto[] =
            this.TransformationService.transformVehicleTypes(
                typesResponse,
            );
            return {
            ...make,
            vehicleTypes,
            };
        }),
        );
        allVehicle.push(...vehicles)
    }

    await this.VehicleRepository.saveVehicles(allVehicle)
    return allVehicle;
  }


}
