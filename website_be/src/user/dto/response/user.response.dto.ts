import { ApiProperty } from "@nestjs/swagger";

export class UserInfoDto {
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