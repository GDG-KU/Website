import { ApiProperty } from '@nestjs/swagger';

export class UserPointDto {
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
