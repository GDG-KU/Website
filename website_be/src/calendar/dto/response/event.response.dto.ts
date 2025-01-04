import { ApiProperty } from "@nestjs/swagger";

export class EventResponseDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "Event title",
    description: "Title",
  })
  title: string;
}