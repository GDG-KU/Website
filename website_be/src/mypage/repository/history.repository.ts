import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { History } from "../entities/history.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(History) private readonly repository: Repository<History>
  ) {}

  async findById(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: number, limit: number, cursor?: Date) {
    
    const queryBuilder = this.repository.createQueryBuilder('history');
    
    queryBuilder.where('history.user_id = :userId', { userId });
    
    if (cursor) {
      queryBuilder.andWhere('history.created_at <= :cursor', { cursor });
    }

    queryBuilder.orderBy('history.created_at', 'DESC');
    queryBuilder.limit(limit);
    return queryBuilder.getMany();
  }
}