import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag) private readonly repository: Repository<Tag>,
  ) {
    super(repository.target, repository.manager);
  }


  async findByTitle(title: string) {
    return await this.repository.findOne({where: {title}});
  }

  async addUser(user_ids: number[], tag_id: number) {
    return await this.repository.createQueryBuilder()
      .relation(Tag, 'users')
      .of(tag_id)
      .add(user_ids);
  }
  
}