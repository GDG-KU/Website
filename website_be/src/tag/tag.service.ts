import { Injectable } from "@nestjs/common";
import { TagRepository } from "./tag.repository";
import { TagUserDto } from "./dto/request/tag_user.dto";

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
  ) {}

  async findAll() {
    return await this.tagRepository.find({relations: ['users']});
  }

  async addUser(tagAddDto: TagUserDto) {
    const {user_ids, tag_id} = tagAddDto;
    console.log(user_ids, tag_id);
    return await this.tagRepository.addUser(user_ids, tag_id);
  }
}