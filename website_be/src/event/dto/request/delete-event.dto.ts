import { ApiProperty } from "@nestjs/swagger";

export class DeleteEventDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;
}