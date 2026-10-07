import { Injectable,BadGatewayException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { XmlParserService } from './xml-parser.service'
import { PinoLogger } from 'nestjs-pino';
@Injectable()
export class NhtsaService {
    constructor(private readonly httpService: HttpService,
          private readonly configService: ConfigService,
          private readonly XmlParserService: XmlParserService,
          private readonly logger: PinoLogger  
    ) {}

        async getVehicleData() {
            try {
                const url = this.configService.get<string>('NHTSA_MAKES_URL') ?? '';

                const response = await firstValueFrom(
                    this.httpService.get(url, {
                    headers: {
                        Accept: 'application/xml',
                    },
                    }),
                );
                const jsonData = this.XmlParserService.convertXMLToJson(response?.data);
                return jsonData;
                
            } catch (error) {
                this.logger.error({ error },'NHTSA API call failed');
                throw new BadGatewayException('NHTSA API call failed');
            }
        }

        async getVehicleTypes(makeId: number) {
            try {
            const baseUrl = this.configService.getOrThrow<string>(
                'NHTSA_VEHICLE_TYPES_URL',
            );

            const url = `${baseUrl}/${makeId}?format=XML`;

            const response = await firstValueFrom(
                this.httpService.get<string>(url, {
                headers: {
                    Accept: 'application/xml',
                },
                }),
            );
            return this.XmlParserService.convertXMLToJson(response?.data);
            } catch (error) {
                this.logger.error({ error },'NHTSA API vehicle types call failed');
                throw new BadGatewayException(`Failed to fetch vehicle types for make ${makeId}`);
            }
        }
    }
    

