import { SetMetadata } from '@nestjs/common';

// 커스텀 데코레이터
export const Authority = (...authorities: string[]) =>
  SetMetadata('authorities', authorities);
