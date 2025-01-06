import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './service/event.service';
import { EventRepository } from './repository/event.repository';
import { TagModule } from 'src/tag/tag.module';
import { Attendance } from './entities/attendance.entity';
import { AttendanceRepository } from './repository/attendance.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendance]), TagModule],
  controllers: [EventController],
  providers: [EventService, EventRepository, AttendanceRepository],
})
export class EventModule {}
