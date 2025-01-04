import { Module } from '@nestjs/common';
import { CalendarService } from './service/calendar.service';
import { CalendarController } from './calendar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calender.entity';
import { Tag } from './entities/tag.entity';
import { CalendarRepository } from './repository/calendar.repository';
import { EventRepository } from './repository/event.repository';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Calendar, Event, Tag])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarRepository, EventRepository],
})
export class CalendarModule {}
