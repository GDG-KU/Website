import { ApiProperty } from "@nestjs/swagger";

export class TagUserDto {
  @ApiProperty({
    example: 1,
    description: "tag_id",
  })
  tag_id: number;

  @ApiProperty({
    example: [1, 2],
    description: "user_ids",
  })
  user_ids: number[];
}