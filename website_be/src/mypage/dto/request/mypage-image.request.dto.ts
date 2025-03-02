import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MypageImageUrlDto {
  @ApiProperty({
    example: 'https://storage.googleapis.com/website-be.appspot.com/mypage/1/profile.jpg',
    description: '이미지 URL',
  })
  @IsNotEmpty()
  @IsString()
  url: string;
}