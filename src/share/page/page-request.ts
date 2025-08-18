import { SortDirection } from '@share/enum/sort-direction.enum';
import { PaginationReq } from '@share/page/request/pagination.req';

export class PageRequest {
  skip: number;
  limit: number;
  sort: Record<string, SortDirection>;

  constructor(skip: number, limit: number, sort: Record<string, SortDirection>) {
    this.skip = skip;
    this.limit = limit;
    this.sort = sort;
  }

  static of(
    page: number = 1,
    pageSize: number = 10,
    sortType: SortDirection = SortDirection.ASC,
    sortField: string = '_id',
  ): PageRequest {
    return new PageRequest((page - 1) * pageSize || 0, pageSize || 10, { [sortField]: sortType });
  }

  static ofRequest<T extends PaginationReq>(request: T): PageRequest {
    const {
      page = 1,
      pageSize = 10,
      sortType = SortDirection.ASC,
      sortField = '_id',
    } = request || {};

    return PageRequest.of(page, pageSize, sortType, sortField);
  }
}
