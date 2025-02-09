import { ApiProperty } from "@nestjs/swagger";
import { RolePointResponseDto } from "./rolepoint.reponse.dto";
import { User } from "src/user/entities/user.entity";


export class UserInfoResponseDto {
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
    type: [RolePointResponseDto],
    description: "Role and Point",
  })
  roles: RolePointResponseDto[];

  static of(user: User): UserInfoResponseDto {
    return {
      id: user.id,
      nickname: user.nickname,
      roles: user.user_roles.map(userRole => RolePointResponseDto.of(userRole))
    }
  }
}


export class UserInfoPaginatedResponseDto {
  @ApiProperty({
    type: [UserInfoResponseDto],
    description: "User Info List",
  })
  data: UserInfoResponseDto[];

  @ApiProperty({
    example: 1,
    description: "Total Count",
  })
  max_size: number;
}