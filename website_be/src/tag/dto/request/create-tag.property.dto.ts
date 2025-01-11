import { ApiProperty } from "@nestjs/swagger";

export class CreateTagPropertyDto {
  @ApiProperty({
    example: 'branch',
    description: '태그 속성',
  })
  tag_property: string;
}