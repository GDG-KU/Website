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
      if (creator > 1) {
        throw new UnauthorizedException('You are not authorized to create a notice');
      }

      const role = await this.roleRepository.findById(createNoticeDto.role_id);
      const notice = new Notice();


      notice.title = createNoticeDto.title;
      notice.content = createNoticeDto.content;
      notice.role_id = role;

      return this.noticeRepository.save(notice);
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

    async update(updator: number, UpdateNoticeDto: UpdateNoticeDto) {
      if (updator > 1) {
        throw new UnauthorizedException('You are not authorized to update a notice');
      }

      const role = await this.roleRepository.findById(UpdateNoticeDto.role_id);
      const notice = new Notice();


      notice.title = UpdateNoticeDto.title;
      notice.content = UpdateNoticeDto.content;
      notice.role_id = role;

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
