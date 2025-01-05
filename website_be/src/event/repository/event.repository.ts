import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {
    super(repository.target, repository.manager);
  }

  findByDate(start_date: Date, end_date: Date) {
    const queryBuilder = this.repository.createQueryBuilder('event');

    queryBuilder.leftJoinAndSelect('event.tag', 'tag');

    /*
    WHERE (event.end_date >= :start_date
       AND event.start_date <= :end_date)
    OR (event.start_date <= :end_date
       AND event.end_date >= :start_date)

    start_date와 end_date 사이에 있는 event를 찾기 위한 쿼리
    */
    queryBuilder.where('event.end_date >= :start_date', { start_date });
    queryBuilder.andWhere('event.start_date <= :end_date', { end_date });
    queryBuilder.orWhere('event.start_date <= :end_date', { end_date });
    queryBuilder.andWhere('event.end_date >= :start_date', { start_date });
    queryBuilder.orderBy('event.start_date', 'ASC');

    return queryBuilder.getMany();
  }
} 