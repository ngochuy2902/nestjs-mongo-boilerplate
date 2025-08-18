import { PageRequest } from '@share/page/page-request';
import { PaginationRes } from '@share/page/response/pagination.res';

export class Page<T> {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPage: number;
  pageRequest: PageRequest;
  records: T[];

  constructor(
    page: number,
    pageSize: number,
    totalRecords: number,
    pageRequest: PageRequest,
    records: T[],
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalRecords = totalRecords;
    this.totalPage = Math.ceil(totalRecords / pageSize);
    this.pageRequest = pageRequest;
    this.records = records;
  }

  hasNext(): boolean {
    return this.page < this.totalPage;
  }

  nextPageable(): PageRequest {
    return new PageRequest(this.page * this.pageSize, this.pageSize, this.pageRequest.sort);
  }

  map<U>(fn: (record: T) => U): PaginationRes<U> {
    return {
      page: this.page,
      pageSize: this.pageSize,
      totalRecords: this.totalRecords,
      totalPage: this.totalPage,
      records: this.records.map(fn),
    };
  }

  static of<T>(records: T[], count: number, pageRequest: PageRequest): Page<T> {
    const { skip, limit } = pageRequest;
    const page = Math.floor(skip / limit) + 1;
    return new Page(page, limit, count, pageRequest, records);
  }
}
