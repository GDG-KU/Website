import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Tag } from './entities/tag.entity';
import { TagProperty } from './entities/tag_property.entity';
import { EventController } from './event.controller';
import { EventService } from './service/event.service';
import { EventRepository } from './repository/event.repository';
import { TagRepository } from './repository/tag.repository';


@Module({
  imports: [TypeOrmModule.forFeature([Event, Tag, TagProperty])],
  controllers: [EventController],
  providers: [EventService, EventRepository, TagRepository],
})
export class EventModule {}
