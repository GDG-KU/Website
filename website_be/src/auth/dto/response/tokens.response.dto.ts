import { ApiProperty } from "@nestjs/swagger";

export class TokensResponseDto {
  @ApiProperty({
    example: 'access_token',
    description: 'JWT access token',
  })
  access_token: string;

  @ApiProperty({
    example: 'refresh_token',
    description: 'JWT refresh token',
  })
  refresh_token: string;
}