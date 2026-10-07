import { Injectable,BadRequestException } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlParserService {
   
   convertXMLToJson(data:any): any{
      try { 
        const parser = new XMLParser({
                    ignoreAttributes: false,
                });
        const json = parser.parse(data);
        return json;

      } catch (error) {
         throw new BadRequestException('Invalid XML response');
      }
   }
}
