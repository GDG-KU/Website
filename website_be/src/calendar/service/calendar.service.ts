import { Injectable, NotFoundException } from '@nestjs/common';
import { CalendarRepository } from '../repository/calendar.repository';
import { CreateCalendarDto } from '../dto/request/create-calendar.dto';
import { EventRepository } from '../repository/event.repository';
import { CalendarResponseDto } from '../dto/response/calender.response.dto';
import { DataSource } from 'typeorm';
import { Event } from '../entities/event.entity';
import { Calendar } from '../entities/calender.entity';
import { FindCalendarDto } from '../dto/request/find-calendar.dto';
import { start } from 'repl';

@Injectable()
export class CalendarService {
  constructor(
    private readonly calendarRepository: CalendarRepository,
    private readonly eventRepository: EventRepository,
    private dataSource: DataSource,
  ) {}

  async createCalendar(createCalendarDto: CreateCalendarDto): Promise<CalendarResponseDto> {
    const {tag, ...calendarData} = createCalendarDto;
    const event = await this.eventRepository.findByTitle(tag); //기존 tag가 있는지 확인
    
    //tag가 없다면 event와 calendar를 생성
    //tag가 있다면 calendar만 생성
    if (!event) {
      let calendar: Calendar;

      //transaction을 사용하여 event와 calendar를 동시에 생성
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try{
        const newevent = await queryRunner.manager.save(Event, {title: tag});
        calendar = await queryRunner.manager.save(Calendar, {...calendarData, event: newevent});

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw err;
      }
      
      await queryRunner.release();
      return calendar;
    }
    else{
      return this.calendarRepository.save({...calendarData, event});
    }
  }

  findByDate(findCalendarDto: FindCalendarDto) {
    const {start_date, end_date} = findCalendarDto;
    return this.calendarRepository.findByDate(start_date, end_date);
  }

  findAll(): Promise<Calendar[]> {
    return this.calendarRepository.find();
  }

  async deleteCalendar(id:number) {
    const result = await this.calendarRepository.delete(id);
    if (!result || result.affected === 0) {
      throw new NotFoundException(`Calendar with ID ${id} not found.`);
    }
    return {message: `Calendar with ID ${id} has been successfully deleted.`};
  }
}
