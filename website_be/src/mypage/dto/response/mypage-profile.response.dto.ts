import { ApiProperty } from "@nestjs/swagger";
import { RolePointResponseDto } from "src/user/dto/response/rolepoint.reponse.dto";

export class MypageProfileResponseDto {
  @ApiProperty({
      example: "김멤버",
      description: "유저 닉네임",
  })
  nickname: string;

  // @ApiProperty({
  //   type: [RolePointResponseDto],
  //   description: "Role and Point",
  // })
  // roles: RolePointResponseDto[];

  @ApiProperty({
    example: "Member",
    description: "유저 역할",
  })
  role: string;

  @ApiProperty({
    example: "2023-01-06",
    description: "가입일",
  })
  joinDate: string;
}
