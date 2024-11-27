import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { Notice } from './entities/notice.entity';
import { RoleRepository } from 'src/user/role.repository';

@Injectable()
export class NoticeService {
    constructor(
      private readonly noticeRepository: NoticeRepository,
      private readonly roleRepository: RoleRepository,
    ) {}

    async create(creator: number, createNoticeDto: CreateNoticeDto) {
      if (creator > 2) {
        throw new UnauthorizedException('You are not authorized to create a notice'); // not authorized
      }

      const role = await this.roleRepository.findById(createNoticeDto.role_id);
      const notice = new Notice();


      notice.title = createNoticeDto.title;
      notice.content = createNoticeDto.content;
      notice.role = role;

      return this.noticeRepository.save(notice);
    }

    async findAllNotice(viewer: number, page: number) {
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

    async findDetailNotice(viewer: number, id: number) {
      const notice = await this.noticeRepository.findById(id);
      
      if (!notice) {
        throw new NotFoundException('Notice not found'); // notice not found
      }
      if (notice.role.id < viewer) {
        throw new UnauthorizedException('You are not authorized to view this notice'); // not authorized
      }

      return notice;
    }

    async update(updator: number, UpdateNoticeDto: UpdateNoticeDto) {
      if (updator > 2) {
        throw new UnauthorizedException('You are not authorized to update a notice'); // not authorized
      }

      const role = await this.roleRepository.findById(UpdateNoticeDto.role_id);
      const notice = new Notice();


      notice.title = UpdateNoticeDto.title;
      notice.content = UpdateNoticeDto.content;
      notice.role = role;

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
