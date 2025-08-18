import { Expose } from 'class-transformer';

export class CtxReq {
  @Expose()
  userId: string;

  @Expose()
  role: string;
}
