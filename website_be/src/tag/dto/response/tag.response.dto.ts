import { ApiProperty } from "@nestjs/swagger";
import { TagPropertyResonseDto } from "./tag.property.response.dto";
import { Tag } from "src/tag/entities/tag.entity";

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

  static of(tag: Tag) {
    return {
      id: tag.id,
      title: tag.title,
      tag_property: tag.tag_property 
      ? {
          id: tag.tag_property.id,
          tag_property: tag.tag_property.tag_property,
      } : null,
    }
  } 
}