import { Controller,Get } from '@nestjs/common';
import { IngestionService } from './services/ingestion.service'

@Controller('ingestion')
export class IngestionController {

    constructor(
        private readonly IngestionService: IngestionService,
             
    ) {}

    @Get()
    getVehicleData(){
        return this.IngestionService.getVehicles();
    }
}
