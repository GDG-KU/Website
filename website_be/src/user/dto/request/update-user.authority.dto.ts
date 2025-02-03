import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserAuthorityDto {
  @ApiProperty({
    example: 1,
    description: "user_id",
  })
  user_id: number;

  @ApiProperty({
    example: ["PointManager", "CalendarManager", "AttendanceManager", "RoleManager", "AuthorityManager"],
    description: "authorities",
  })
  authorities: string[];
}