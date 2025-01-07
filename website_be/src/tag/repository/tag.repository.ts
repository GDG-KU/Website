import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "../entities/tag.entity";

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
    const existingTag = await this.repository.findOne({where: {id: tag_id}, relations: ['users']});
    
    if (!existingTag) {
      throw new BadRequestException('Tag not found');
    }

    const queryBuilder = this.repository.createQueryBuilder();

    const existingUser = existingTag.users;
    const existingUserIds = existingUser.map(user => user.id);

    const new_user_ids = user_ids.filter(user_id => !existingUserIds.includes(user_id));

    if (new_user_ids.length === 0) {
      throw new BadRequestException('All users already exist');
    }

    try {
      return await queryBuilder
        .relation(Tag, 'users')
        .of(tag_id)
        .add(new_user_ids);
    }
    catch (err) {
      throw new BadRequestException('Invalid user id');
    }
  }

  async removeUser(user_ids: number[], tag_id: number) {
    return await this.repository.createQueryBuilder()
      .relation(Tag, 'users')
      .of(tag_id)
      .remove(user_ids);
  }

  async setProperty(tag_id: number, property_id: number) {
    const existingTag = await this.repository.findOne({where: {id: tag_id}, relations: ['tag_property']});
    
    if (!existingTag) {
      throw new BadRequestException('Tag not found');
    }

    const queryBuilder = this.repository.createQueryBuilder();
  
    try {
      return await queryBuilder
        .relation(Tag, 'tag_property')
        .of(tag_id)
        .set(property_id);
    }
    catch (err) {
      throw new BadRequestException('Invalid property id');
    }
  }
    
  
}