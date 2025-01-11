import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "src/tag/entities/tag.entity";
import { UserInfoDto } from "src/user/dto/response/user.response.dto";


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
    type: () => [UserInfoDto],
    description: "User info",
  })
  users: UserInfoDto[];

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