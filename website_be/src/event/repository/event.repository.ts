import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { User } from "src/user/entities/user.entity";
import { Attendance } from "../../attendance/entities/attendance.entity";

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {
    super(repository.target, repository.manager);
  }

  async findTagUsersByEventId(event_id: number) {
    const queryBuilder = this.repository.createQueryBuilder('event');

    queryBuilder.leftJoinAndSelect('event.tag', 'tag');
    queryBuilder.leftJoinAndSelect('tag.users', 'users');
    queryBuilder.where('event.id = :event_id', { event_id });
    return queryBuilder.getOne();
  }

  findByDate(start_date: Date, end_date: Date, user?: User) {
    const queryBuilder = this.repository.createQueryBuilder('event');

    queryBuilder.leftJoinAndSelect('event.tag', 'tag');
    queryBuilder.leftJoinAndSelect('tag.tag_property', 'tag_property');

    if (user) {
      queryBuilder.innerJoin('event.attendances', 'attendances');
      queryBuilder.where('attendances.user_id = :user_id', { user_id: user.id });
    }

    /*
    WHERE (event.end_date >= :start_date
       AND event.start_date <= :end_date)
    OR (event.start_date <= :end_date
       AND event.end_date >= :start_date)

    start_date와 end_date 사이에 있는 event를 찾기 위한 쿼리
    */
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.where(new Brackets (
          (subqb) => {
            subqb.where('event.end_date >= :start_date', { start_date });
            subqb.andWhere('event.start_date <= :end_date', { end_date });
          }
        ))
        qb.orWhere(new Brackets (
          (subqb) => {
            subqb.where('event.start_date <= :end_date', { end_date });
            subqb.andWhere('event.end_date >= :start_date', { start_date });
          }
        ))
    }))
    queryBuilder.orderBy('event.start_date', 'ASC');

    return queryBuilder.getMany();
  }
} 