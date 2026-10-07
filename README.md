# Vehicle Data Service

A NestJS-based vehicle data service that fetches vehicle makes and vehicle types from the NHTSA API, transforms XML responses, stores the data in MongoDB, and exposes it through GraphQL.

## Tech Stack

* NestJS
* TypeScript
* MongoDB
* Mongoose
* GraphQL
* NHTSA vPIC API
* fast-xml-parser
* Pino
* Docker

## Architecture

```text
                    ┌──────────────────────┐
                    │      GraphQL Client  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Vehicle Resolver   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Vehicle Service    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Vehicle Repository   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │       MongoDB        │
                    └──────────────────────┘


        NHTSA API
            │
            ▼
    ┌───────────────────┐
    │ Ingestion Service │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │   XML Parser      │
    └─────────┬─────────┘
              │
              ▼
    ┌───────────────────┐
    │ Vehicle Transformer│
    └─────────┬─────────┘
              │
              ▼
           MongoDB
```

## Data Flow

```text
NHTSA API
   ↓
XML Response
   ↓
XML Parser
   ↓
Transformation
   ↓
MongoDB
   ↓
GraphQL
   ↓
Client
```

## GraphQL

GraphQL endpoint:

```text
http://localhost:3000/graphql
```

### Get all vehicles

```graphql
query {
  getAllVehicles {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```

### Get vehicle by makeId

```graphql
query {
  getVehicleByMakeId(makeId: 440) {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```

### Filter vehicles

The API can also accept optional filters such as `makeId`, `makeName`, and `typeName`.

```graphql
query {
  getVehicle(
    makeId: 440
    makeName: "Acura"
    typeName: "Car"
  ) {
    makeId
    makeName
    vehicleTypes {
      typeId
      typeName
    }
  }
}
```

## MongoDB Model

The `Vehicle` collection contains:

```text
Vehicle
├── makeId
├── makeName
├── vehicleTypes[]
│   ├── typeId
│   └── typeName
├── createdAt
└── updatedAt
```

Example document:

```json
{
  "makeId": 440,
  "makeName": "Acura",
  "vehicleTypes": [
    {
      "typeId": 1,
      "typeName": "Car"
    }
  ]
}
```

`makeId` is configured as a unique field to prevent duplicate vehicle makes.

## Configuration

Create a `.env` file:

```env
PORT=3000

MONGODB_URI=mongodb://localhost:27017/vehicle-service

NHTSA_MAKES_URL=https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML

NHTSA_VEHICLE_TYPES_URL=https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId

LOG_LEVEL=info

NODE_ENV=development
```

The application reads configuration from environment variables instead of hardcoding environment-specific values.

## Error Handling

The application uses centralized error handling through a global NestJS exception filter.

The following errors are handled:

* NHTSA API errors
* XML parsing errors
* Data transformation errors
* MongoDB/database errors
* Unexpected application errors

Example error response:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "timestamp": "2026-10-07T12:00:00.000Z"
}
```

Expected external API failures are converted into appropriate HTTP exceptions such as:

```text
BadRequestException
BadGatewayException
InternalServerErrorException
NotFoundException
```

## Logging

The application uses **Pino** for structured logging.

Logging is implemented for:

* Application startup
* Ingestion start and completion
* API calls
* Number of records processed
* Database operations
* Application errors

Example:

```text
INFO  Vehicle ingestion started
INFO  Vehicles fetched successfully
INFO  Vehicle ingestion completed
ERROR NHTSA API call failed
```

## Docker

Build the application:

```bash
docker build -t vehicle-data-service .
```

Run:

```bash
docker run -p 3000:3000 vehicle-data-service
```

For local MongoDB from inside Docker:

```text
mongodb://host.docker.internal:27017/vehicle-service
```

## Installation

```bash
npm install
```

## Run the Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## Project Structure

vehicle-data-service/
│
├── src/
│   │
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── config/
│   │   ├── configuration.ts
│   │   └── env.validation.ts
│   │
│   ├── common/
│   │   ├── filter/
│   │   │   └── global-exception.filter.ts
│   │   
│   │
│   ├── ingestion/
│   │   ├── ingestion.module.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── ingestion.controller.ts
│   │   │
│   │   ├── services/
│   │   │   ├── ingestion.service.ts
│   │   │   ├── nhtsa.service.ts
│   │   │   ├── xml-parser.service.ts
│   │   │   └── transformation.service.ts
│   │   │
│   │   ├── interfaces/
│   │   │   └── vehicle-data.interface.ts
│   │   │
│   │   └── dto/
│   │       └── ingestion-result.dto.ts
│   │
│   ├── vehicles/
│   │   ├── vehicles.module.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── vehicle.schema.ts
│   │   │
│   │   ├──  vehicle.repository.ts
│   │   │
│   │   ├──  vehicle.service.ts
│   │
│   └── graphql/
│       ├── graphql.module.ts
│       │
│       ├── resolvers/
│       │   └── vehicle.resolver.ts
│       │
│       └── types/
│           └── vehicle.type.ts
│
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── nest-cli.json
├── README.md
│
└── .github/
    └── workflows/
        └── ci.yml
