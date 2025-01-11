import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
  @ApiProperty({
    example: 'gdg@gmail.com'
  })
  email: string;
  
  @ApiProperty({
    example: '김구글'
  })
  nickname: string;
}