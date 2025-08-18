import mongoose from 'mongoose';

import { ApplicationConfig } from '@config/application.config';
import AddDefaultUserSeeder from '@database/seed/seeders/AddDefaultUserSeeder';

(async () => {
  await mongoose.connect(ApplicationConfig.databaseUri);

  const seeder = new AddDefaultUserSeeder();
  await seeder.run(mongoose.connection);

  await mongoose.disconnect();
})();
