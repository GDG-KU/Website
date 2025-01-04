import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Calendar } from "../entities/calender.entity";

@Injectable()
export class CalendarRepository extends Repository<Calendar> {
  constructor(
    @InjectRepository(Calendar) private readonly repository: Repository<Calendar>,
  ) {
    super(repository.target, repository.manager);
  }

  findByDate(start_date: Date, end_date: Date) {
    const queryBuilder = this.repository.createQueryBuilder('calendar');

    queryBuilder.leftJoinAndSelect('calendar.event', 'event');

    /*
    WHERE (calendar.end_date >= :start_date
       AND calendar.start_date <= :end_date)
    OR (calendar.start_date <= :end_date
       AND calendar.end_date >= :start_date)

    start_date와 end_date 사이에 있는 calendar를 찾기 위한 쿼리
    */
    queryBuilder.where('calendar.end_date >= :start_date', { start_date });
    queryBuilder.andWhere('calendar.start_date <= :end_date', { end_date });
    queryBuilder.orWhere('calendar.start_date <= :end_date', { end_date });
    queryBuilder.andWhere('calendar.end_date >= :start_date', { start_date });
    queryBuilder.orderBy('calendar.start_date', 'ASC');

    return queryBuilder.getMany();
  }
} 