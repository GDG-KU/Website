import { Body, Controller, Get, Post } from "@nestjs/common";
import { TagService } from "./tag.service";
import { ApiOperation } from "@nestjs/swagger";
import { TagUserDto } from "./dto/request/tag_user.dto";

@Controller('tag')
export class TagController {
  constructor(
    private readonly tagService: TagService,
  ) {}

  @Get('findall')
  @ApiOperation({ summary: '모든 태그 조회'})
  async findAll() {
    return await this.tagService.findAll();
  }

  @Post("adduser")
  @ApiOperation({ summary: '태그에 출석해야하는 user 추가 // 이미 있는 user 추사시 error + 존재하지 않는 tag나 user일 시 error'})
  async addUser(@Body() tagAddDto: TagUserDto) {
    return await this.tagService.addUser(tagAddDto);
  }
}
