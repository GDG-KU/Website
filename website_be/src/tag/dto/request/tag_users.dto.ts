import { ApiProperty } from "@nestjs/swagger";

export class TagUsersDto {
  @ApiProperty({
    example: [1, 2],
    description: "user_ids",
  })
  user_ids: number[];
}