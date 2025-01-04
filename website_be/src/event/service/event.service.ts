import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TagRepository } from '../repository/tag.repository';
import { EventRepository } from '../repository/event.repository';
import { CreateEventDto } from '../dto/request/create-event.dto';
import { EventResponseDto } from '../dto/response/event.response.dto';
import { Tag } from '../entities/tag.entity';
import { Event } from '../entities/event.entity';
import { FindEventDto } from '../dto/request/find-event.dto';


@Injectable()
export class EventService {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly tagRepository: TagRepository,
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
      } catch (err) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw err;
      }
      
      await queryRunner.release();
      return event;
    }
    else{
      return this.eventRepository.save({...eventData, origintag});
    }
  }

  findByDate(findEventDto: FindEventDto) {
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
