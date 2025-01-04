import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Event } from "../entities/event.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class EventRepository extends Repository<Event> {
  constructor(
    @InjectRepository(Event) private readonly repository: Repository<Event>,
  ) {
    super(repository.target, repository.manager);
  }


  async findByTitle(title: string) {
    return await this.repository.findOne({where: {title}});
  }
  
}