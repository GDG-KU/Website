import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { EventService } from './service/event.service';
import { CreateEventDto } from './dto/request/create-event.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DeleteEventDto } from './dto/request/delete-event.dto';
import { FindEventDto } from './dto/request/find-event.dto';
import { EventResponseDto } from './dto/response/event.response.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: '일정 생성'})
  @ApiResponse({
    description: '일정 생성 성공',
    type: EventResponseDto,
  })
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvent(createEventDto);
  }

  @Post(':event_id/attendance')
  @ApiOperation({ summary: '일정 참석 여부 생성'})
  setAttendance(@Param('event_id') event_id: number) {
    return this.eventService.setAttendance(event_id);
  }

  @Get("all")
  @ApiOperation({ summary: '모든 일정 조회'})
  findAll() {
    return this.eventService.findAll();
  }

  @Get("bydate")
  @ApiOperation({ summary: 'start_date와 end_date 사이에 있는 일정 조회'})
  @ApiResponse({
    description: '일정 조회 성공',
    type: [EventResponseDto],
  })
  findByDate(@Query() findEventDto: FindEventDto) {
    return this.eventService.findByDate(findEventDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: '일정 삭제'})
  deleteEvent(@Param() deleteEventDto: DeleteEventDto) {
    return this.eventService.deleteEvent(deleteEventDto.id);
  }
}
