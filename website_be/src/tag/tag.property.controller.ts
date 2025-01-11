import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateTagPropertyDto } from "./dto/request/create-tag.property.dto";
import { TagPropertyService } from "./service/tag.property.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TagPropertyResonseDto } from "./dto/response/tag.property.response.dto";

@Controller('tag/property')
export class TagPropertyController {
  constructor(
    private readonly tagPropertyService: TagPropertyService,
  ) {}

  @Post()
  @ApiOperation({ summary: '태그 속성 생성 // branch, fetch, hotfix 등'})
  @ApiResponse({
    description: '태그 속성 생성 성공',
    type: TagPropertyResonseDto,
  })
  createTagProperty(@Body() createTagPropertyDto: CreateTagPropertyDto) {
    return this.tagPropertyService.createTagProperty(createTagPropertyDto.tag_property);
  }

  @Get('all')
  @ApiOperation({ summary: '모든 태그 속성 조회'})
  @ApiResponse({
    description: '태그 속성 조회 성공',
    type: [TagPropertyResonseDto],
  })
  async findAll() {
    return await this.tagPropertyService.findAll();
  }

  @Delete(':id')
  @ApiOperation({ summary: '태그 속성 삭제'})
  async deleteTagProperty(@Param('id') id: number) {
    return await this.tagPropertyService.deleteTagProperty(id);
  }
}