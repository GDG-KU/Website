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
  findAllNotice(@Query('page') page: number) {
    return this.noticeService.findAllNotice(page);
  }

  @Get('detail/:id')
  @ApiOperation({ summary: 'Get a notice detail' })
  findDetailNotice(@Param('id') id: number) {
    return this.noticeService.findDetailNotice(id);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a notice' })
  update(@Body() UpdateNoticeDto: UpdateNoticeDto) {
    const updator = 1;
    return this.noticeService.update(updator, UpdateNoticeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a notice' })
  remove(@Param('id') id: string) {
    const deleter = 1;
    return this.noticeService.remove(deleter, +id);
  }
}
