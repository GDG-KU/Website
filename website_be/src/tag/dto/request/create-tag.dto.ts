import { ApiProperty } from "@nestjs/swagger";

export class CreateTagDto {
  @ApiProperty({
    example: 'branch/fe',
    description: '태그 이름',
  })
  title: string;
  
  @ApiProperty({
    example: 1,
    description: '태그 속성 id',
  })
  tag_property_id: number;
}