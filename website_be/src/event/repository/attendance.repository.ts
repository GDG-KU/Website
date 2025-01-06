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

  async setAttendance(event: Event, users: User[]) {
    const userEvents = users.map(user => {
      const userEvent = new Attendance();
      userEvent.user = user;
      userEvent.event = event;
      return userEvent;
    });
    return await this.repository.save(userEvents);
  }
}