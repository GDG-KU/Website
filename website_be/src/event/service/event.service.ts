import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { EventRepository } from '../repository/event.repository';
import { CreateEventDto } from '../dto/request/create-event.dto';
import { EventResponseDto } from '../dto/response/event.response.dto';
import { Tag } from '../../tag/entities/tag.entity';
import { Event } from '../entities/event.entity';
import { FindEventDto } from '../dto/request/find-event.dto';
import { TagRepository } from 'src/tag/repository/tag.repository';
import { AttendanceRepository } from '../../attendance/repository/attendance.repository';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { UserRepository } from 'src/user/user.repository';


@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly tagRepository: TagRepository,
    private readonly attendanceRepository: AttendanceRepository,
    private readonly userRepositroy: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const {tag_id, ...eventData} = createEventDto;
    const origintag = await this.tagRepository.findById(tag_id); //기존 tag가 있는지 확인
    
    //tag가 없다면 에러
    if (!origintag) {
      throw new NotFoundException(`Tag with ID ${tag_id} not found.`);
    }
    
    const users = await this.userRepositroy.find();
    const user_ids = users.map(user => user.id)

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const event = await queryRunner.manager.save(Event, {...eventData, tag: origintag});

      await this.attendanceRepository.upsertAttendance(event.id, user_ids, queryRunner);
      await queryRunner.commitTransaction();

      return event;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async setAttendance(event_id: number) {
    const event = await this.eventRepository.findTagUsersByEventId(event_id);

    if(!event){
      throw new NotFoundException(`Event with ID ${event_id} not found.`);
    }

    const users = await this.userRepositroy.find();
    const user_ids = users.map(user => user.id)

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      await this.attendanceRepository.upsertAttendance(event_id, user_ids, queryRunner);
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
