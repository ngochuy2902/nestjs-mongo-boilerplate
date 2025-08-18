import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';
import * as dotenv from 'dotenv';

import { ApplicationConfig } from '@config/application.config';

dotenv.config({ path: '.env' });

export const MongoDBConfig: MongooseModuleOptions = {
  uri: ApplicationConfig.databaseUri,
};
