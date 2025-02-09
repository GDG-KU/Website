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
      tag_property:  
      {
          id: tag.tag_property.id,
          tag_property: tag.tag_property.tag_property,
      },
    }
  }
}

export class TagUserResponseDto extends TagResponseDto {
  @ApiProperty({
    example: true,
    description: "Is attend",
  })
  is_attend: boolean;
  
  static rawof(tag) {
    return {
      id: tag.tag_id,
      title: tag.tag_title,
      tag_property:
      {
          id: tag.property_id,
          tag_property: tag.property_tag_property,
      },
      is_attend: tag.is_attend == 1 ? true : false,
    }
  }
}