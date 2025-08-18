// import { FilterQuery, Model } from 'mongoose';
//
// import { PageRequest } from '@share/page/page-request';
//
// export async function findAndCount<T>(
//   model: Model<T>,
//   query: FilterQuery<T>,
//   pageRequest: PageRequest,
// ): Promise<[T[], number]> {
//   const { skip, limit, sort } = pageRequest;
//
//   const [records, totalRecords] = await Promise.all([
//     model.find(query).skip(skip).limit(limit).sort(sort).lean<T[]>().exec(),
//     model.countDocuments(query),
//   ]);
//
//   return [records, totalRecords];
// }
