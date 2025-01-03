import { ApiProperty } from "@nestjs/swagger";

export class RefreshDto {
  @ApiProperty({
    example: 'refresh_token',
    description: 'JWT refresh token',
  })
  refresh_token: string;
}