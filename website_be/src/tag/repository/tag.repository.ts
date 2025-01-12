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


  async findById(id: number) {
    return await this.repository.findOne({where: {id}});
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