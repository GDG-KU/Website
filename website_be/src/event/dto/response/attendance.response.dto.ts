import { ApiProperty } from "@nestjs/swagger";
import { UserInfoDto } from "src/user/dto/response/user.response.dto";
import { EventResponseDto } from "./event.response.dto";

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

  @ApiProperty({
    type: EventResponseDto,
    description: "Event info",
  })
  event: EventResponseDto;
}