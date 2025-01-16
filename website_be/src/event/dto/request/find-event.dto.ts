import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";

export class FindEventDto {
  @ApiProperty({
    example: "2025-01-01T00:00:00Z",
    description: "start date",
  })
  start_date: Date;

  @ApiProperty({
    example: "2025-01-28T00:00:00Z",
    description: "end date",
  })
  end_date: Date;

  @ApiProperty({
    example: true,
    description: "is my activity",
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_my_activity: boolean;
}