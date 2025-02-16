import { ApiProperty } from "@nestjs/swagger";

export class FindUserDto{
  @ApiProperty({
    example: 1,
    description: 'Page',
  })
  page: number;

  @ApiProperty({
    example: 'DevRel',
    description: 'Role',
  })
  role: string;
}