import { ApiProperty } from '@nestjs/swagger';

export class UserPointDto {
  @ApiProperty({
    example: '7',
    description: '변경할 유저 id',
  })
  userId: number;

  @ApiProperty({
    example: 'organizer',
    description: '변경할 role',
  })
  role: string;

  @ApiProperty({
    example: '-5',
    description: '증가, 감소할 point',
  })
  point: number;

  @ApiProperty({
    example: '이유',
    description: '변경 이유',
  })
  reason: string;
  
  @ApiProperty({
    example: '1주차',
    description: '변경 이유에 대한 날짜',
  })
  reason_date: string; 
}
