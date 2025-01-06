import { Injectable } from "@nestjs/common";
import { TagRepository } from "../repository/tag.repository";
import { TagUsersDto } from "../dto/request/tag_users.dto";
import { TagRelationsResponseDto } from "../dto/response/tag.relations.response.dto";

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
  ) {}

  async findAll(): Promise<TagRelationsResponseDto[]> {
    const tags = await this.tagRepository.find({relations: ['users', 'tag_property']});
    console.log(tags);
    return tags.map(tag => TagRelationsResponseDto.of(tag));
  }

  async addUser(id: number, tagUsersDto: TagUsersDto) {
    const {user_ids} = tagUsersDto;
    return await this.tagRepository.addUser(user_ids, id);
  }

  async deleteUser(id: number, tagUsersDto: TagUsersDto) {
    const {user_ids} = tagUsersDto;
    return await this.tagRepository.removeUser(user_ids, id);
  }

  async setProperty(tag_id: number, property_id: number) {
    return await this.tagRepository.setProperty(tag_id, property_id);
  }
}