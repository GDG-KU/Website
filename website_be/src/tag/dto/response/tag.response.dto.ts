import { ApiProperty } from "@nestjs/swagger";
import { TagPropertyResonseDto } from "./tag.property.response.dto";

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
    type: TagPropertyResonseDto,
    description: "Tag property",
  })
  tag_property: TagPropertyResonseDto;
}