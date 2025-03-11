import { ApiProperty } from '@nestjs/swagger';
import { Faq } from 'src/faq/entities/faq.entity';
import { UserResponseDto } from 'src/user/dto/response/user.response.dto';

export class FaqResponseDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the FAQ'
  })
  id: number;

  @ApiProperty({
    type: UserResponseDto,
    description: 'The user who created the FAQ'
  })
  user: UserResponseDto;

  @ApiProperty({
    example: 'NestJS란 무엇인가요?',
    description: 'The question of the FAQ'
  })
  question: string;

  @ApiProperty({
    example: 'NestJS는 효율적이고 확장 가능한 Node.js 서버 사이드 애플리케이션을 구축하기 위한 프레임워크입니다.',
    description: 'The answer of the FAQ'
  })
  answer: string;

  @ApiProperty({
    example: '2021-08-31T07:00:00.000Z',
    description: 'The date and time when the FAQ was created'
  })
  created_at: Date;

  @ApiProperty({
    example: '2021-08-31T07:00:00.000Z',
    description: 'The date and time when the FAQ was last updated'
  })
  updated_at: Date;

  static of(faq: Faq): FaqResponseDto {
    return {
      id: faq.id,
      user: {
        id: faq.user.id,
        nickname: faq.user.nickname
      },
      question: faq.question,
      answer: faq.answer,
      created_at: faq.created_at,
      updated_at: faq.updated_at
    }
  }

}
