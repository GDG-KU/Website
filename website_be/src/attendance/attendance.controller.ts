import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AttendanceResponseDto } from './dto/response/attendance.response.dto';
import { UpdateAttendancesDto } from './dto/request/update-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get(':event_id')
  @ApiOperation({ summary: '해당 이벤트의 유저 참석 여부 조회' })
  @ApiResponse({
    type: [AttendanceResponseDto],
    description: '해당 이벤트 유저의 참석여부 조회',
  })
  getAttendanceByEventId(@Param('event_id') event_id: number) {
    return this.attendanceService.getAttendanceByEventId(event_id);
  }

  @Patch()
  @ApiOperation({ summary: '참석 여부 수정' })
  updateAttendances(@Body() updateAttendancesDto: UpdateAttendancesDto) {
    return this.attendanceService.updateAttendances(updateAttendancesDto);
  }
}
