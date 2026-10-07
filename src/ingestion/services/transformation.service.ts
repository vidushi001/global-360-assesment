import { Injectable,InternalServerErrorException } from '@nestjs/common';
import {
  VehicleMakeDto,
  VehicleTypeDto,
} from '../dto/ingestion-result.dto';

@Injectable()
export class TransformationService {
    transformMakes(AllVehicleMakes: any): VehicleMakeDto[] {
        try{
            const makes = AllVehicleMakes ?? [];

            return makes.map((make: any) => ({
                makeId: Number(make.Make_ID),
                makeName: make.Make_Name,
                vehicleTypes: [],
            }));
        } catch (error){
            throw new InternalServerErrorException(
                'Vehicle data transformation failed',
            );
        }    
  }

  transformVehicleTypes(response: any): VehicleTypeDto[] {
    try {
        const types =
        response?.Response?.Results?.VehicleTypesForMakeIds ?? [];
        const typesArray = Array.isArray(types)
        ? types
        : [types];
        return typesArray.map((type: any) => ({
        typeId: Number(type.VehicleTypeId),
        typeName: type.VehicleTypeName,
        })) || [];
    } catch (error){
        throw new InternalServerErrorException(
            'Vehicle data transformation failed',
        );
    }
  }


}

