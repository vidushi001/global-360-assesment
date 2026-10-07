import { Injectable } from '@nestjs/common';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class XmlParserService {

     convertXMLToJson(data:any): any{
        const parser = new XMLParser({
                    ignoreAttributes: false,
                });
        const json = parser.parse(data);
        return json;

     }
}
