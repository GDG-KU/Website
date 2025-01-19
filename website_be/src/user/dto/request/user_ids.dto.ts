import { ApiProperty } from "@nestjs/swagger";

export class UserIdsDto {
    @ApiProperty({
      example: [1, 2],
      description: "user_ids",
    })
    user_ids: number[];
}