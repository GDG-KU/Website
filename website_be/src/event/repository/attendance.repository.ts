import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AttendanceRepository {
  constructor(
    @InjectRepository(Attendance) private readonly repository: Repository<Attendance>,
  ) {}

  async findOneByEventAndUser(event: Event, user: User) {
    return await this.repository.findOne({where: {event, user}});
  }

  async findUsersByEvent(event_id: number) {
    const queryBuilder = this.repository.createQueryBuilder('attendance');

    queryBuilder.leftJoinAndSelect('attendance.user', 'user');
    queryBuilder.where('attendance.event_id = :event_id', { event_id });

    return queryBuilder.getMany();
  }
}