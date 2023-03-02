import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  async offsetLimitParser(
    offset = 0,
    limit = 25,
  ): Promise<{ offset: number; limit: number }> {
    offset = offset < 0 ? 0 : offset;
    limit = limit <= 0 ? 25 : limit > 25 ? 25 : limit;
    return { offset, limit };
  }
}
