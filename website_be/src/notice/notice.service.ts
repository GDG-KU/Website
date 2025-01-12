import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class NoticeService {
    constructor(
      private readonly noticeRepository: NoticeRepository,
      private readonly userRepository: UserRepository,
    ) {}

    async create(creator: number, createNoticeDto: CreateNoticeDto) {
      if (creator > 2) {
        throw new UnauthorizedException('You are not authorized to create a notice'); // not authorized
      }
      const notice = new Notice();
      const user = await this.userRepository.findById(1);

      notice.title = createNoticeDto.title;
      notice.content = createNoticeDto.content;
      notice.user = user;

      return this.noticeRepository.save(notice);
    }

    async findAllNotice(page: number) {
      if (page < 1) {
        page = 1; // default page is 1
      } 

      const take = 10; // take is 10
      const skip = (page - 1) * take; // default skip is 0

      const [notices, total] = await this.noticeRepository.findAllNotice(skip, take);
      const totalPage = Math.ceil((total as number) / take);

      return {
        data: notices,
        totalPage,
      }
    }

    async findDetailNotice(id: number) {
      const notice = await this.noticeRepository.findById(id);
      
      if (!notice) {
        throw new NotFoundException('Notice not found'); // notice not found
      }

      return notice;
    }

    async update(updator: number, UpdateNoticeDto: UpdateNoticeDto) {
      if (updator > 2) {
        throw new UnauthorizedException('You are not authorized to update a notice'); // not authorized
      }

      const notice = new Notice();


      notice.title = UpdateNoticeDto.title;
      notice.content = UpdateNoticeDto.content;

      return this.noticeRepository.update(UpdateNoticeDto.id, notice);
    }

    async remove(deletor: number, id: number) {
      if (deletor > 1) {
        throw new UnauthorizedException('You are not authorized to delete a notice');
      }
      const notice = await this.noticeRepository.findById(id);

      if (!notice) {
        throw new NotFoundException('Notice not found');
      }

      await this.noticeRepository.remove(notice);
      
      return `Notice${id} deleted successfully`;
    }
}
