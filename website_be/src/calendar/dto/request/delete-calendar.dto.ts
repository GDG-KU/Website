import { ApiProperty } from "@nestjs/swagger";

export class DeleteCalendarDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;
}