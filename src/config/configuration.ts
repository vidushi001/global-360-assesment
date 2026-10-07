

export default () => ({

  PORT: Number(process.env.PORT ?? 3000),

  MONGODB_URI:process.env.MONGODB_URI ?? 'mongodb://localhost:27017/vehicle-service',

  NHTSA_MAKES_URL:process.env.NHTSA_MAKES_URL ?? 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML',

  NHTSA_VEHICLE_TYPES_URL:process.env.NHTSA_VEHICLE_TYPES_URL ?? 'https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId',

  LOG_LEVEL:'info',
  
  NODE_ENV:'development'

});