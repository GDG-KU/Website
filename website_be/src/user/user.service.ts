import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserRoleRepository } from './repository/user_role.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly user_roleRepository: UserRoleRepository,
    private dataSources: DataSource,
  ) {}
 
  async create(createUserDto) {
    const { role_ids, ...userInfo } = createUserDto;

    const queryRunner = this.dataSources.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.save(User, userInfo);
      await this.user_roleRepository.saveUserRoles(user.id, role_ids, queryRunner);
      await queryRunner.commitTransaction();

      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.userRepository.findAll();
  }
}
