import { BadRequestException, Injectable } from "@nestjs/common";
import { TagPropertyRepository } from "../repository/tag.property.repository";
import { TagPropertyResonseDto } from "../dto/response/tag.property.response.dto";

@Injectable()
export class TagPropertyService {
  constructor(
    private readonly tagPropertyRepository: TagPropertyRepository
  ) {}

  async createTagProperty(property: string): Promise<TagPropertyResonseDto> {
    return await this.tagPropertyRepository.createTagProperty(property);
  }

  async findAll() {
    return await this.tagPropertyRepository.find();
  }

  async deleteTagProperty(id: number) {
    let result;
    
    try{
      result = await this.tagPropertyRepository.delete(id);
    }
    catch (error) {
      throw new BadRequestException('Tag property cannot be deleted');
    }
    if (result.affected === 0) {
      throw new BadRequestException('Tag property not found');
    }

    return {message: `Tag property with id ${id} has been deleted`};
  }
  
}