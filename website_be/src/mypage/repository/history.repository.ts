import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { History } from '../entities/history.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistoryRepository extends Repository<History> {
  constructor(
    @InjectRepository(History) private readonly repository: Repository<History>,
  ) {
    super(repository.target, repository.manager);
  }

  async findById(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  async findByIdWithUser(id: number) {
    return await this.repository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  // async findByUserId(user_id: number, limit: number, cursor?: number) {
  //   const queryBuilder = this.repository.createQueryBuilder('history');

  //   queryBuilder.where('history.user_id = :user_id', { user_id });

  //   if (cursor) {
  //     queryBuilder.andWhere('history.id < :cursor', { cursor });
  //   }

  //   queryBuilder.orderBy('history.id', 'DESC');
  //   queryBuilder.limit(limit);
  //   return queryBuilder.getMany();
  // }

  async findByUserIdWithRole(
    userId: number,
    role: string,
    limit: number,
    cursor?: number,
  ) {
    const queryBuilder = this.repository.createQueryBuilder('history');

    queryBuilder.where('history.user_id = :userId', { userId });
    if (role) {
      queryBuilder.andWhere('history.role = :role', { role });
    }

    if (cursor) {
      queryBuilder.andWhere('history.id < :cursor', { cursor });
    }

    queryBuilder.orderBy('history.id', 'DESC');
    queryBuilder.limit(limit);
    return queryBuilder.getMany();
  }
}
