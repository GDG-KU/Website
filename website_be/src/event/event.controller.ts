import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EventService } from './service/event.service';
import { CreateEventDto, UpdateEventDto } from './dto/request/create-event.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FindEventDto } from './dto/request/find-event.dto';
import { EventResponseDto } from './dto/response/event.response.dto';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: '일정 생성 및 동기화'})
  @ApiResponse({
    description: '일정 생성 성공',
    type: EventResponseDto,
  })
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Post(':event_id/attendance')
  @ApiOperation({ summary: '일정 참석 여부 동기화'})
  setAttendance(@Param('event_id') event_id: number) {
    return this.eventService.setAttendance(event_id);
  }

  @Get("all")
  @ApiOperation({ summary: '모든 일정 조회 // 개발용'})
  findAll() {
    return this.eventService.findAll();
  }

  @Get("bydate")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: 'start_date와 end_date 사이에 있는 일정 조회'})
  @ApiResponse({
    description: '일정 조회 성공',
    type: [EventResponseDto],
  })
  findByDate(@Req() req, @Query() findEventDto: FindEventDto) {
    const {user} = req;
    return this.eventService.findByDate(findEventDto, user);
  }

  @Patch(":id")
  @ApiOperation({ summary: '일정 수정'})
  updateEvent(@Param("id") id: number,@Body() updateEventDto: UpdateEventDto) {
    return this.eventService.updateEvent(id, updateEventDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: '일정 삭제'})
  deleteEvent(@Param('id') id: number) {
    return this.eventService.deleteEvent(id);
  }
}
