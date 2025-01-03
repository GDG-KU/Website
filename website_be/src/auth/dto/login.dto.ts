import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
        example: '1234@google.com',
        description: 'User email'
    })
    email: string;

    @ApiProperty({
        example: '홍길동',
        description: 'User nickname'
    })
    nickname: string;
}