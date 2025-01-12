import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventController } from './event.controller';
import { EventService } from './service/event.service';
import { EventRepository } from './repository/event.repository';
import { TagModule } from 'src/tag/tag.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { UserModule } from 'src/user/user.module';


@Module({
  imports: [TypeOrmModule.forFeature([Event]), TagModule, AttendanceModule, UserModule],
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
