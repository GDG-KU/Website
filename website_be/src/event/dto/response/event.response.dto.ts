import { ApiProperty } from "@nestjs/swagger";
import { TagResponseDto } from "src/tag/dto/response/tag.response.dto";

export class EventResponseDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "/WK3",
    description: "Title",
  })
  title: string;

  @ApiProperty({
    example: "2025-01-01T00:00:00Z",
    description: "Start date",
  })
  start_date: Date;

  @ApiProperty({
    example: "2025-01-02T00:00:00Z",
    description: "End date",
  })
  end_date: Date;

  @ApiProperty({
    example: "우정정보관 B101",
    description: "Location",
  })
  location: string;

  @ApiProperty({
    example: "http://google.com",
    description: "URL",
  })
  url: string;
  
  @ApiProperty({
    type: TagResponseDto,
    description: "Event detail",
  })
  tag: TagResponseDto;
}