import { ApiProperty } from "@nestjs/swagger";

export class RolePointResponseDto {
  @ApiProperty({
    example: "Role name",
    description: "Role name",
  })
  role: string;

  @ApiProperty({
    example: 0,
    description: "Role point",
  })
  point: number;
}