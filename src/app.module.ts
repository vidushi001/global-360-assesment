import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VehicleModule } from './vehicle/vehicle.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { GraphQlModule } from './graph-ql/graph-ql.module';
import { ConfigModule,ConfigService  } from '@nestjs/config';
import { validate } from './config/env.validation';
import configuration from './config/configuration'
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
       load: [configuration],
      validate,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
       path: '/api/graphql'
    }),
     LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL || 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    VehicleModule, 
    IngestionModule, 
    GraphQlModule],
  controllers: [AppController],
  providers: [AppService],
  // exports:[VehicleModule]
})
export class AppModule {}
