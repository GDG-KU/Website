import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@ApiTags('Notice')
@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a notice' })
  create(@Body() createNoticeDto: CreateNoticeDto) {
    const creator = 1;
    return this.noticeService.create(creator, createNoticeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notice' })
  findAllNotice(@Query('page') page: number = 1) {
    const viewer = 1;
    return this.noticeService.findAllNotice(page, viewer);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a notice' })
  update(@Body() UpdateNoticeDto: UpdateNoticeDto) {
    const updator = 1;
    return this.noticeService.update(updator, UpdateNoticeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticeService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.noticeService.remove(+id);
  }
}
