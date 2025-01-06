import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "src/tag/entities/tag.entity";

class TagWithUserInfoDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "User nickname",
    description: "Nickname",
  })
  nickname: string;

  @ApiProperty({
    example: "User point",
    description: "Point",
  })
  point: number;
}

export class TagWithPropertyDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "branch",
    description: "tag_property",
  })
  tag_property: string;
}

export class TagRelationsResponseDto {
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
    type: () => [TagWithUserInfoDto],
    description: "User info",
  })
  users: TagWithUserInfoDto[];

  @ApiProperty({
    type: () => TagWithPropertyDto,
    description: "Tag property",
  })
  tag_property: TagWithPropertyDto;

  static of(tag: Tag) {
    return {
      id: tag.id,
      title: tag.title,
      users: tag.users.map(user => ({
        id: user.id,
        nickname: user.nickname,
        point: user.point,
      })),
      tag_property: tag.tag_property 
      ? {
          id: tag.tag_property.id,
          tag_property: tag.tag_property.tag_property,
        }
      : null,
    }
  }
}