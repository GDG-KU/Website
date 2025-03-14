import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AttendanceResponseDto } from './dto/response/attendance.response.dto';
import { UpdateAttendancesDto } from './dto/request/update-attendance.dto';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';
import { UserIdsDto } from 'src/user/dto/request/user_ids.dto';
import { AuthorityGuard } from 'src/auth/security/authority.guard';
import { SetAuthority } from 'src/auth/security/authority.decorator';

@Controller('attendance')
@ApiBearerAuth('token') 
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get(':event_id')
  @SetAuthority('AttendanceManager')
  @ApiOperation({ summary: '해당 이벤트의 유저 참석 여부 조회 // admin API' })
  @ApiResponse({
    type: [AttendanceResponseDto],
    description: '해당 이벤트 유저의 참석여부 조회',
  })
  getAttendanceByEventId(@Param('event_id') event_id: number) {
    return this.attendanceService.getAttendanceByEventId(event_id);
  }

  @Patch(':event_id')
  @ApiOperation({ summary: '해당 이벤트에 대한 출석체크' })
  @ApiQuery({ name: 'reason', required: false })
  @ApiQuery({ name: 'is_attend', required: false })
  checkAttendance(@Req() req, @Param('event_id') event_id: number, @Query('reason') reason?: string, @Query('is_attend') is_attend?: boolean) {
    const {user} = req;
    return this.attendanceService.checkAttendance(event_id, user, is_attend, reason);
  }

  @Patch()
  @SetAuthority('AttendanceManager')
  @ApiOperation({ summary: '참석 여부 수정 // admin API' })
  updateAttendances(@Body() updateAttendancesDto: UpdateAttendancesDto) {
    return this.attendanceService.updateAttendances(updateAttendancesDto);
  }

  @Post(':event_id/users')
  @SetAuthority('AttendanceManager')
  @ApiOperation({ summary: '이벤트에 참석해야하는 사람 추가 // admin API' })
  addUsersToEvent(@Param('event_id') event_id: number, @Body() userIdsDto: UserIdsDto) {
    return this.attendanceService.addUsersByEvent(event_id, userIdsDto);
  }

  @Delete(':event_id/users')
  @SetAuthority('AttendanceManager')
  @ApiOperation({ summary: '이벤트에 참석해야하는 사람 삭제 // admin API' })
  deleteUsersByEvent(@Param('event_id') event_id: number, @Body() userIdsDto: UserIdsDto) {
    return this.attendanceService.deleteUsersByEvent(event_id, userIdsDto);
  }
}
