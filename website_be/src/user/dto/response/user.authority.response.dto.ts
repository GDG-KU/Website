import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";

export class UserAuthorityResponseDto {
  @ApiProperty({
    example: 1,
    description: "id",
  })
  id: number;

  @ApiProperty({
    example: ["PointManager"],
    description: "authority",
  })
  authority: string[];

  static of(user: User): UserAuthorityResponseDto {
    return {
      id: user.id,
      authority: user.authoritys.map(authority => authority.type)
    }
  }
}