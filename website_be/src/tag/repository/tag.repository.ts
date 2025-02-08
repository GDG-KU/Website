import { BadRequestException, Injectable } from "@nestjs/common";
import { DataSource, QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "../entities/tag.entity";

@Injectable()
export class TagRepository extends Repository<Tag> {
  constructor(
    @InjectRepository(Tag) private readonly repository: Repository<Tag>,
  ) {
    super(repository.target, repository.manager);
  }

  async findAll(property?: string, user_id?: number) {
    const queryBuilder = this.repository.createQueryBuilder('tag');
    
    queryBuilder.select(['tag.id', 'tag.title']);
    queryBuilder.leftJoinAndSelect('tag.tag_property', 'property');

    if (property) {
        queryBuilder.where('property.tag_property = :property', {property});
    }

    if (user_id) {
      queryBuilder.addSelect(`
        CASE
          WHEN (SELECT COUNT(*) FROM user_tag WHERE user_id = ${user_id} AND tag_id = tag.id) > 0 THEN 1
          ELSE 0
        END 
        `, 
      'is_attend');
      queryBuilder.orderBy('is_attend', 'DESC');
    }

    queryBuilder.addOrderBy('tag.id', 'DESC');
    return await queryBuilder.getRawMany();
  }

  async findById(id: number) {
    return await this.repository.findOne({where: {id}, relations: ['tag_property', 'users']});
  }

  async addUser(user_ids: number[], tag: Tag) {
    const queryBuilder = this.repository.createQueryBuilder();
    const existingUser = tag.users;
    const existingUserIds = existingUser.map(user => user.id);
    const new_user_ids = user_ids.filter(user_id => !existingUserIds.includes(user_id));
    
    if (new_user_ids.length === 0) {
      throw new BadRequestException('All users already exist');
    }
    try {
      return await queryBuilder
        .relation(Tag, 'users')
        .of(tag.id)
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

  async setAllUsers(user_ids: number[], tag_id: number, queryRunner: QueryRunner) {
    try{
      for (const user_id of user_ids) {
        await queryRunner.manager.query(
          `
          INSERT INTO \`user_tag\` (\`user_id\`, \`tag_id\`)
          VALUES (?, ?)
          `,
          [user_id, tag_id]
        );
      }
    }catch (err) {
      throw err;
    }
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