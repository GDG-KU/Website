import { ApiProperty } from "@nestjs/swagger";
import { TagWithPropertyDto } from "./tag.relations.response.dto";

export class TagResponseDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "Tag title",
    description: "Title",
  })
  title: string;

  @ApiProperty({
    type: TagWithPropertyDto,
    description: "Tag property",
  })
  tag_property: TagWithPropertyDto;
}