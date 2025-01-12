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

    async findAllNotice(skip: number, take: number) {
        const queryBuilder = this.repository.createQueryBuilder('notice');
        queryBuilder.select(['notice.id', 'notice.title', 'notice.content', 'notice.created_at']);
        queryBuilder.orderBy('notice.created_at', 'DESC');
        queryBuilder.skip(skip).take(take);
        
        const [notices, total] = await queryBuilder.getManyAndCount();
        return [notices, total];
    }

    async findById(id: number){
        return await this.repository.findOne({where: {id}});
    }
    

}