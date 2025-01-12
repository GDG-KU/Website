import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { TagProperty } from "../entities/tag_property.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class TagPropertyRepository extends Repository<TagProperty> {
  constructor(
    @InjectRepository(TagProperty) private readonly repository: Repository<TagProperty>,
  ) {
    super(repository.target, repository.manager);
  }

  async findById(id: number) {
    return await this.repository.findOne({where: {id}});
  }

  async createTagProperty(property: string) {
    const existingTagProperty = await this.repository.findOne({where: {tag_property: property}});

    if (existingTagProperty) {
      throw new BadRequestException('Tag property already exists');
    }
    return await this.repository.save({tag_property: property});
  }
}