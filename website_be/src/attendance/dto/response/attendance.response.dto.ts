import { ApiProperty } from "@nestjs/swagger";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { UserInfoDto } from "src/user/dto/response/user.response.dto";

export class AttendanceResponseDto {
  @ApiProperty({
    example: 1,
    description: "ID",
  })
  id: number;

  @ApiProperty({
    example: true,
    description: "Attendance",
  })
  is_attend: boolean;

  @ApiProperty({
    example: "Reason",
    description: "Reason",
  })
  reason: string;

  @ApiProperty({
    type: UserInfoDto,
    description: "User info",
  })
  user: UserInfoDto;

  static of(attendance: Attendance) {
    return {
      id: attendance.id,
      is_attend: attendance.is_attend,
      reason: attendance.reason,
      user: {
        id: attendance.user.id,
        nickname: attendance.user.nickname,
        point: attendance.user.point,
      }
    }
  }
}