import { ApiProperty } from "@nestjs/swagger";
import { Tag } from "src/tag/entities/tag.entity";
import { UserInfoResponseDto } from "src/user/dto/response/user.response.dto";
import { TagPropertyResonseDto } from "./tag.property.response.dto";


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
    type: () => [UserInfoResponseDto],
    description: "User",
  })
  users: UserInfoResponseDto[];


  @ApiProperty({
    type: () => TagPropertyResonseDto,
    description: "Tag property",
  })
  tag_property: TagPropertyResonseDto;

  static of(tag: Tag) {
    return {
      id: tag.id,
      title: tag.title,
      users: tag.users.map(user => ({
        id: user.id,
        nickname: user.nickname,
        roles: user.user_roles.map(user_role => ({
          role: user_role.role.role_type,
          point: user_role.point
        })),
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