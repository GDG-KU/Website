import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
    constructor(
      private readonly noticeRepository: NoticeRepository,
    ) {}

    create(creator: number, createNoticeDto: CreateNoticeDto) {
      if (creator > 1) {
        throw new UnauthorizedException('You are not authorized to create a notice');
      }

      return this.noticeRepository.save(createNoticeDto);
    }

    async findAllNotice(page: number,viewer: number) {
      if (page < 1) {
        page = 1; // default page is 1
      } 

      const take = 10; // take is 3
      const skip = (page - 1) * take; // default skip is 0

      const [notices, total] = await this.noticeRepository.findAllNotice(skip, take, viewer);
      const totalPage = Math.ceil((total as number) / take);

      return {
        data: notices,
        totalPage,
      }
    }

    findOne(id: number) {
      return `This action returns a #${id} notice`;
    }

    update(updator: number, UpdateNoticeDto: UpdateNoticeDto) {
      if (updator > 1) {
        throw new UnauthorizedException('You are not authorized to update a notice');
      }
      return this.noticeRepository.update(UpdateNoticeDto.id, UpdateNoticeDto);
    }

    remove(id: number) {
      return `This action removes a #${id} notice`;
    }
}
