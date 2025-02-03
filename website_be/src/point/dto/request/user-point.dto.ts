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
}
