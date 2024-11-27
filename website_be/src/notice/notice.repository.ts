import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Notice } from "./entities/notice.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class NoticeRepository extends Repository<Notice> {
    constructor(
        @InjectRepository(Notice) private readonly repository: Repository<Notice>,
    ) {
        super(repository.target, repository.manager);
    }

    async findAllNotice(skip: number, take: number, viewer: number) {
        const queryBuilder = this.repository.createQueryBuilder('notice');
        queryBuilder.leftJoin('notice.role', 'role');
        queryBuilder.where('role.id >= :viewer', { viewer });
        queryBuilder.select(['notice.id', 'notice.title', 'notice.created_at', 'role.role_type']);
        queryBuilder.orderBy('notice.created_at', 'DESC');
        queryBuilder.skip(skip).take(take);
        
        const [notices, total] = await queryBuilder.getManyAndCount();
        return [notices, total];
    }

    async findById(id: number){
        return await this.repository.findOne({where: {id}, relations: ['role']});
    }
    

}