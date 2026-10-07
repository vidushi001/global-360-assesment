import { Resolver, Query, Args, Int} from '@nestjs/graphql';

import { Vehicle } from '../types/vehicle.type';
import { VehicleRepository } from '../../vehicle/vehicle.repository';

@Resolver(() => Vehicle)
export class VehicleResolver {
  constructor(
    private readonly VehicleRepository: VehicleRepository,
  ) {}

  @Query(() => [Vehicle])
  async vehicles(
        @Args('makeId', { type: () => Int, nullable: true }) makeId?: number,
        @Args('makeName', { type: () => String, nullable: true }) makeName?: string,
        @Args('typeName', { type: () => String, nullable: true }) typeName?: string,
    ): Promise<Vehicle[]> {
    return this.VehicleRepository.findAll(makeId ?? null, makeName ?? null,typeName ?? null);
  }

  @Query(() => Vehicle,{ nullable : true})
  async getVehicleByMakeId(
     @Args('makeId', { type: () => Int }) makeId: number
    ): Promise<Vehicle | null> {
    return this.VehicleRepository.findByMakeId(makeId);
  }


}