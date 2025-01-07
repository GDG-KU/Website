import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { EventRepository } from '../repository/event.repository';
import { CreateEventDto } from '../dto/request/create-event.dto';
import { EventResponseDto } from '../dto/response/event.response.dto';
import { Tag } from '../../tag/entities/tag.entity';
import { Event } from '../entities/event.entity';
import { FindEventDto } from '../dto/request/find-event.dto';
import { TagRepository } from 'src/tag/repository/tag.repository';
import { AttendanceRepository } from '../repository/attendance.repository';
import { Attendance } from '../entities/attendance.entity';


@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly tagRepository: TagRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private dataSource: DataSource,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const {tag, ...eventData} = createEventDto;
    const origintag = await this.tagRepository.findByTitle(tag); //기존 tag가 있는지 확인
    
    //tag가 없다면 tag와 event를 생성
    //tag가 있다면 event만 생성
    if (!origintag) {
      let event: Event;

      //transaction을 사용하여 tag와 event를 동시에 생성
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      try{
        const newtag = await queryRunner.manager.save(Tag, {title: tag});
        event = await queryRunner.manager.save(Event, {...eventData, tag: newtag});

        await queryRunner.commitTransaction();
        return event;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }
    }
    else{
      return this.eventRepository.save({...eventData, tag: origintag});
    }
  }

  async setAttendance(event_id: number) {
    const event = await this.eventRepository.findTagUsersByEventId(event_id);

    if(!event){
      throw new NotFoundException(`Event with ID ${event_id} not found.`);
    }
    if(!event.tag){
      throw new NotFoundException(`Event with ID ${event_id} not have tag.`);
    }
    if(!event.tag.users){
      throw new NotFoundException(`Tag with ID ${event.tag.id} not have users.`);
    }

    const users = event.tag.users;
    const existingAttendances = await this.attendanceRepository.findUsersByEvent(event_id);
    const existingUserIds = existingAttendances.map(attendance => attendance.user.id);

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let user of users) {
        if (!existingUserIds.includes(user.id)) {
          await queryRunner.manager.save(Attendance, {event, user});
        }
      }
      for (let user_id of existingUserIds) {
        if (!users.some(user => user.id === user_id)) {
          await queryRunner.manager.delete(Attendance, {event: event_id, user: user_id});
        }
      }

      await queryRunner.commitTransaction();
      return {message: `Attendance for event with ID ${event_id} has been successfully set.`};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findByDate(findEventDto: FindEventDto): Promise<EventResponseDto[]> {
    const {start_date, end_date} = findEventDto;
    return this.eventRepository.findByDate(start_date, end_date);
  }

  findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async deleteEvent(id:number) {
    const result = await this.eventRepository.delete(id);
    if (!result || result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found.`);
    }
    return {message: `Event with ID ${id} has been successfully deleted.`};
  }
}
