import { ApiProperty } from "@nestjs/swagger";

export class MypageProfileRequestDto {
  @ApiProperty({
    example: 1,
    description: "User ID",
  })
  userId: number;
}

export class UpdateUserDto {
  @ApiProperty({ example: '새로운닉네임', description: 'Nickname of the user' })
  nickname: string;
}
