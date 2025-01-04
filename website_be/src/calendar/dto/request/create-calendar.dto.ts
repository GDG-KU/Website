import { ApiProperty } from "@nestjs/swagger";

export class CreateCalendarDto {
  @ApiProperty({
    example: "/WK3",
    description: "Title",
  })
  title: string;

  @ApiProperty({
    example: "2021-09-01T00:00:00Z",
    description: "Start date",
  })
  start_date: Date;

  @ApiProperty({
    example: "2021-09-02T00:00:00Z",
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
    example: "branch/fe",
    description: "Tag",
  })
  tag: string;
}