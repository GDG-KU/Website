import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {
    super(repository.target, repository.manager);
  }

  async findAll(page: number, role_id: number) {
    const limit = 15;
    const queryBuilder = this.repository.createQueryBuilder('user');
    
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');

    if (role_id) {
      queryBuilder.where('role.id = :role_id', { role_id });
    }

    queryBuilder.orderBy('user.nickname', 'ASC');
    queryBuilder.skip((page - 1) * limit);
    queryBuilder.take(limit);
    const [users, total] = await queryBuilder.getManyAndCount();

    const max_size = Math.ceil(total / limit);
    return { users, max_size };
  }

  async findById(id: number) {
    const queryBuilder = this.repository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');
    queryBuilder.leftJoinAndSelect('user.authoritys', 'authority');
    queryBuilder.where('user.id = :id', { id });
    return queryBuilder.getOne();
  }

  async findByEmail(email: string) {
    // return await this.repository.findOne({ where: { email } });
    const queryBuilder = this.repository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');
    queryBuilder.leftJoinAndSelect('user.authoritys', 'authority');
    queryBuilder.where('user.email = :email', { email });
    return queryBuilder.getOne();
  }

  async updateRefreshToken(id: number, refresh_token: string) {
    return await this.repository.update(id, { refresh_token });
  }

  async findByStudentNumber(studentNumber: string) {
    return await this.repository.findOne({
      where: { student_number: studentNumber },
    });
  }
}
