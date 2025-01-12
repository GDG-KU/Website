import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { TagService } from "./service/tag.service";
import { ApiOperation, ApiResetContentResponse, ApiResponse } from "@nestjs/swagger";
import { TagRelationsResponseDto } from "./dto/response/tag.relations.response.dto";
import { CreateTagDto } from "./dto/request/create-tag.dto";

@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get('all')
  @ApiOperation({ summary: '모든 태그 조회'})
  @ApiResponse({
    description: '태그 조회 성공',
    type: [TagRelationsResponseDto],
  })
  async findAll() {
    return await this.tagService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '태그 생성'})
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }


  @Patch(":tag_id/property/:property_id")
  @ApiOperation({ summary: '태그 속성 설정'})
  async setProperty(@Param('tag_id') tag_id:number, @Param('property_id') property_id:number) {
    return await this.tagService.setProperty(tag_id, property_id);
  }
}
