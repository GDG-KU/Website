import { ApiProperty } from '@nestjs/swagger';

export class CreateFaqDto {
  @ApiProperty({ example: 'NestJS란 무엇인가요?' })
  question: string;

  @ApiProperty({ example: 'NestJS는 효율적이고 확장 가능한 Node.js 서버 사이드 애플리케이션을 구축하기 위한 프레임워크입니다.' })
  answer: string;
}
