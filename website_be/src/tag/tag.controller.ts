import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { TagService } from "./service/tag.service";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TagRelationsResponseDto } from "./dto/response/tag.relations.response.dto";
import { CreateTagDto } from "./dto/request/create-tag.dto";
import { UserIdsDto } from "src/user/dto/request/user_ids.dto";

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

  @Get(":tag_id/users")
  @ApiOperation({ summary: '태그를 출석해야하는 user와 함께 조회'})
  async findTagDetail(@Param('tag_id') id: number) {
    return await this.tagService.findTagDetail(id);
  }

  @Post()
  @ApiOperation({ summary: '태그 생성'})
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @Post(":tag_id/users")
  @ApiOperation({ summary: '태그에 출석해야하는 user 추가 // 이미 있는 user 추가시 error + 존재하지 않는 tag나 user일 시 error'})
  async addUser(@Param('tag_id') id:number, @Body() userIdsDto: UserIdsDto) {
    return await this.tagService.addUser(id, userIdsDto);
  }
  @Delete(":tag_id/users")
  @ApiOperation({ summary: '태그에 출석해야하는 user 삭제'})
  async deleteUser(@Param('tag_id') id:number, @Body() userIdsDto: UserIdsDto) {
    return await this.tagService.deleteUser(id, userIdsDto);
  }


  @Patch(":tag_id/property/:property_id")
  @ApiOperation({ summary: '태그 속성 설정'})
  async setProperty(@Param('tag_id') tag_id:number, @Param('property_id') property_id:number) {
    return await this.tagService.setProperty(tag_id, property_id);
  }
}
