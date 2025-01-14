import { ApiProperty } from "@nestjs/swagger";
import { RolePointResponseDto } from "./rolepoint.reponse.dto";


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
}