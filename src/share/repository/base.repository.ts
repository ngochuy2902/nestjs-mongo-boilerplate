import { FilterQuery, Model, QueryOptions } from 'mongoose';

import { PageRequest } from '@share/page/page-request';
import { BaseSchemaModel } from '@share/schema/base.schema';

export abstract class BaseRepository<T extends BaseSchemaModel> {
  protected updateOptions: QueryOptions = {
    new: true,
    runValidators: true,
    upsert: true,
    setDefaultsOnInsert: true,
  };

  protected constructor(protected model: Model<T>) {}

  async save(entity: Partial<T>, options?: QueryOptions): Promise<T> {
    if (entity._id) {
      return this.model
        .findByIdAndUpdate(entity._id, entity, {
          ...this.updateOptions,
          ...options,
        })
        .exec();
    }

    const created = new this.model(entity);
    return created.save();
  }

  async findAndCount<T>(
    model: Model<T>,
    query: FilterQuery<T>,
    pageRequest: PageRequest,
  ): Promise<[T[], number]> {
    const { skip, limit, sort } = pageRequest;

    const [records, totalRecords] = await Promise.all([
      model.find(query).skip(skip).limit(limit).sort(sort).lean<T[]>().exec(),
      model.countDocuments(query),
    ]);

    return [records, totalRecords];
  }
}
