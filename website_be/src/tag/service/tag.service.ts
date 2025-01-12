import { BadRequestException, Injectable } from "@nestjs/common";
import { TagRepository } from "../repository/tag.repository";
import { TagRelationsResponseDto } from "../dto/response/tag.relations.response.dto";
import { TagPropertyRepository } from "../repository/tag.property.repository";

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly tagPropertyRepository: TagPropertyRepository,
  ) {}

  async findAll(): Promise<TagRelationsResponseDto[]> {
    const tags = await this.tagRepository.find({relations: ['tag_property']});
    console.log(tags);
    return tags.map(tag => TagRelationsResponseDto.of(tag));
  }

  async create(createTagDto) {
    const { tag_property_id, title} = createTagDto;
    const existingProperty = await this.tagPropertyRepository.findById(tag_property_id);
    
    if(!existingProperty) {
      throw new BadRequestException('Property not found');
    }

    return await this.tagRepository.save({title, tag_property: existingProperty});
  }


  async setProperty(tag_id: number, property_id: number) {
    return await this.tagRepository.setProperty(tag_id, property_id);
  }
}