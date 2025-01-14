import { BadRequestException, Injectable } from "@nestjs/common";
import { TagRepository } from "../repository/tag.repository";
import { TagPropertyRepository } from "../repository/tag.property.repository";
import { TagResponseDto } from "../dto/response/tag.response.dto";
import { UserIdsDto } from "src/user/dto/request/user_ids.dto";
import { TagRelationsResponseDto } from "../dto/response/tag.relations.response.dto";
import { UserRepository } from "src/user/repository/user.repository";
import { DataSource } from "typeorm";
import { query } from "express";
import { Tag } from "../entities/tag.entity";

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly tagPropertyRepository: TagPropertyRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<TagResponseDto[]> {
    return await this.tagRepository.find({relations: ['tag_property']});
  }

  async findTagDetail(id: number): Promise<TagRelationsResponseDto> {
    const existingTag = await this.tagRepository.findOne({where: {id}, relations: ['users', 'tag_property']});
    
    if (!existingTag) {
      throw new BadRequestException('Tag not found');
    }

    const users = existingTag.users.map(user => this.userRepository.findById(user.id));
    existingTag.users = await Promise.all(users);

    return TagRelationsResponseDto.of(existingTag);
  }

  async addUser(id: number, useridsDto: UserIdsDto) {
    const existingTag = await this.tagRepository.findOne({where: {id}, relations: ['users']});
    
    if (!existingTag) {
      throw new BadRequestException('Tag not found');
    }

    const {user_ids} = useridsDto;
    return await this.tagRepository.addUser(user_ids, existingTag);
  }
  async deleteUser(id: number, useridsDto: UserIdsDto) {
    const existingTag = await this.tagRepository.findOne({where: {id}, relations: ['users']});
    
    if (!existingTag) {
      throw new BadRequestException('Tag not found');
    }
    
    const {user_ids} = useridsDto;
    return await this.tagRepository.removeUser(user_ids, id);
  }

  async create(createTagDto) {
    const { tag_property_id, title} = createTagDto;
    const existingProperty = await this.tagPropertyRepository.findById(tag_property_id);
    
    if(!existingProperty) {
      throw new BadRequestException('Property not found');
    }

    if (existingProperty.tag_property === 'fetch') {
      const queryRunner = this.dataSource.createQueryRunner();

      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const tag = await queryRunner.manager.save(Tag, {title, tag_property: existingProperty});
        const users = await this.userRepository.find();
        
        const user_ids = users.map(user => user.id);

        await this.tagRepository.setAllUsers(user_ids, tag.id, queryRunner);
        await queryRunner.commitTransaction();

        return tag;
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
      }


    }
    else{
      return await this.tagRepository.save({title, tag_property: existingProperty});
    }
  }


  async setProperty(tag_id: number, property_id: number) {
    return await this.tagRepository.setProperty(tag_id, property_id);
  }
}