import { Module,forwardRef  } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './services/ingestion.service';
import { NhtsaService } from './services/nhtsa.service';
import { TransformationService } from './services/transformation.service';
import { XmlParserService } from './services/xml-parser.service';
import { HttpModule } from '@nestjs/axios';
import { VehicleModule } from '../vehicle/vehicle.module'

@Module({
  imports:[ forwardRef(() => VehicleModule),
  HttpModule],
  controllers: [IngestionController],
  providers: [IngestionService,NhtsaService,TransformationService,XmlParserService],
  exports: [
    IngestionService,
  ]
})
export class IngestionModule {}
