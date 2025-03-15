import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TagService } from "./service/tag.service";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { TagRelationsResponseDto } from "./dto/response/tag.relations.response.dto";
import { CreateTagDto } from "./dto/request/create-tag.dto";
import { UserIdsDto } from "src/user/dto/request/user_ids.dto";
import { JwtAuthGuard } from "src/auth/security/jwt.guard";
import { AuthorityGuard } from "src/auth/security/authority.guard";
import { SetAuthority } from "src/auth/security/authority.decorator";
import { TagUserResponseDto } from "./dto/response/tag.response.dto";

@Controller('tag')
@ApiBearerAuth('token') 
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get()
  @ApiOperation({ summary: '태그 조회 // admin API'})
  @ApiResponse({
    description: '태그 조회 성공',
    type: [TagUserResponseDto],
  })
  @SetAuthority('CalendarManager')
  @ApiQuery({ name: 'property', required: false, type: String })
  @ApiQuery({ name: 'user_id', required: false, type: Number })
  async findAll(@Query('property') property?: string, @Query('user_id') user_id?: number) {
    return await this.tagService.findAll(property, user_id);
  }

  @Get(":tag_id/users")
  @ApiOperation({ summary: '태그를 출석해야하는 user와 함께 조회'})
  async findTagDetail(@Param('tag_id') id: number) {
    return await this.tagService.findTagDetail(id);
  }

  @Post()
  @ApiOperation({ summary: '태그 생성 // admin API'})
  @SetAuthority('CalendarManager')
  async create(@Body() createTagDto: CreateTagDto) {
    return await this.tagService.create(createTagDto);
  }

  @Post(":tag_id/users")
  @ApiOperation({ summary: '태그에 출석해야하는 user 추가 // 이미 있는 user 추가시 error + 존재하지 않는 tag나 user일 시 error // admin API'})
  @SetAuthority('CalendarManager')
  async addUser(@Param('tag_id') id:number, @Body() userIdsDto: UserIdsDto) {
    return await this.tagService.addUser(id, userIdsDto);
  }


  @Delete(":tag_id/users")
  @ApiOperation({ summary: '태그에 출석해야하는 user 삭제 // admin API'})
  @SetAuthority('CalendarManager')
  async deleteUser(@Param('tag_id') id:number, @Body() userIdsDto: UserIdsDto) {
    return await this.tagService.deleteUser(id, userIdsDto);
  }


  @Patch(":tag_id/property/:property_id")
  @ApiOperation({ summary: '태그 속성 설정 // admin API'})
  @SetAuthority('CalendarManager')
  async setProperty(@Param('tag_id') tag_id:number, @Param('property_id') property_id:number) {
    return await this.tagService.setProperty(tag_id, property_id);
  }
}
