import { Body, Controller, Delete, Get, NotFoundException, Post } from '@nestjs/common';
import { CalendarService } from './service/calendar.service';
import { CreateCalendarDto } from './dto/request/create-calendar.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteCalendarDto } from './dto/request/delete-calendar.dto';
import { FindCalendarDto } from './dto/request/find-calendar.dto';
import { CalendarResponseDto } from './dto/response/calender.response.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post("create")
  @ApiOperation({ summary: '일정 생성'})
  @ApiResponse({
    description: '일정 생성 성공',
    type: CreateCalendarDto,
  })
  createEvent(@Body() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.createCalendar(createCalendarDto);
  }

  @Get("all")
  @ApiOperation({ summary: '모든 일정 조회'})
  findAll() {
    return this.calendarService.findAll();
  }

  @Post("findByDate")
  @ApiOperation({ summary: 'start_date와 end_date 사이에 있는 일정 조회'})
  @ApiResponse({
    description: '일정 조회 성공',
    type: [CalendarResponseDto],
  })
  findByDate(@Body() findCalendarDto: FindCalendarDto) {
    return this.calendarService.findByDate(findCalendarDto);
  }

  @Delete("delete")
  @ApiOperation({ summary: '일정 삭제'})
  deleteCalendar(@Body() deleteCalendarDto: DeleteCalendarDto) {
    return this.calendarService.deleteCalendar(deleteCalendarDto.id);
  }
}
