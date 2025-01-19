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

  async findByUserId(userId: number, limit: number, cursor?: { id: number, date: Date }) {
    
    const queryBuilder = this.repository.createQueryBuilder('history');
    
    queryBuilder.where('history.user_id = :userId', { userId });
    
    if (cursor) {
      queryBuilder.andWhere('(history.created_at < :cursor_date OR (history.created_at = :cursor_date AND history.id > :cursor_id))', {cursor_id: cursor.id, cursor_date: cursor.date});
    }

    queryBuilder.orderBy('history.created_at', 'DESC');
    queryBuilder.addOrderBy('history.id', 'ASC');
    queryBuilder.limit(limit);
    return queryBuilder.getMany();
  }
}