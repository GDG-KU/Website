import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CreateTagPropertyDto } from "./dto/request/create-tag.property.dto";
import { TagPropertyService } from "./service/tag.property.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { TagPropertyResonseDto } from "./dto/response/tag.property.response.dto";
import { AuthorityGuard } from "src/auth/security/authority.guard";
import { JwtAuthGuard } from "src/auth/security/jwt.guard";
import { SetAuthority } from "src/auth/security/authority.decorator";

@Controller('tag/property')
@ApiBearerAuth('token') 
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class TagPropertyController {
  constructor(
    private readonly tagPropertyService: TagPropertyService,
  ) {}

  @Post()
  @SetAuthority('CalendarManager')
  @ApiOperation({ summary: '태그 속성 생성 // branch, fetch, hotfix 등 // admin API'})
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
  @SetAuthority('CalendarManager')
  @ApiOperation({ summary: '태그 속성 삭제 // admin API'})
  async deleteTagProperty(@Param('id') id: number) {
    return await this.tagPropertyService.deleteTagProperty(id);
  }
}