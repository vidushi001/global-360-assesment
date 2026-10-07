import { Module,forwardRef } from '@nestjs/common';
import { VehicleModule } from '../vehicle/vehicle.module'
import {VehicleResolver} from './resolvers/vehicle.resolver'
@Module({
     imports:[ forwardRef(() => VehicleModule)],
     providers : [VehicleResolver]
})
export class GraphQlModule {}
