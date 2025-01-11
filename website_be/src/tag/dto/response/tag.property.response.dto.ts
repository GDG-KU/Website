import { ApiProperty } from "@nestjs/swagger";

export class TagPropertyResonseDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: "branch",
    description: "tag_property",
  })
  tag_property: string;
}