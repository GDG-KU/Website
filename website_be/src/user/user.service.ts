import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserRoleRepository } from './repository/user_role.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/request/update-user.role.dto';
import { getHighestRoleId, getRoleIdByName } from 'src/common/enums/user-role.enum';
import { UserInfoResponseDto } from './dto/response/user.response.dto';


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

  async updateRoles(admin: User, updateUserRoleDto: UpdateUserRoleDto): Promise<UserInfoResponseDto> {
    // admin의 가장 높은 role을 가져옴
    // id가 낮은 수록 높은 role을 의미
    const admin_role_id = getHighestRoleId(admin.user_roles.map(user_role => user_role.role.id));


    const user = await this.userRepository.findById(updateUserRoleDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // user의 가장 높은 role이 admin의 가장 높은 role보다 높으면 권한이 없음
    const user_role_id = getHighestRoleId(user.user_roles.map(user_role => user_role.role.id));
    if (admin_role_id >= user_role_id) {
      throw new UnauthorizedException('권한이 없습니다.');
    }

    const { roles } = updateUserRoleDto;
    const role_ids = roles.map(role => getRoleIdByName(role));

    const insert_role_ids = role_ids.filter(role_id => !user.user_roles.some(user_role => user_role.role.id === role_id));
    const delete_role_ids = user.user_roles.filter(user_role => !role_ids.some(role_id => user_role.role.id === role_id)).map(user_role => user_role.role.id);
    
    // insert하려는 가장 높은 role과 delete하려는 가장 높은 role을 가져옴
    const highest_insert_role_id = getHighestRoleId(insert_role_ids);
    const highest_delete_role_id = getHighestRoleId(delete_role_ids);

    // insert 또는 delete하려는 role이 admin의 가장 높은 role보다 높으면 권한이 없음
    if (admin_role_id >= highest_insert_role_id || admin_role_id >= highest_delete_role_id) {
      throw new UnauthorizedException('권한이 없습니다.');
    }
    
    
    const queryRunner = this.dataSources.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      await this.user_roleRepository.saveUserRoles(user.id, insert_role_ids, queryRunner);
      await this.user_roleRepository.deleteUserRoles(user.id, delete_role_ids, queryRunner);

      await queryRunner.commitTransaction();
  
      const updated_user = await this.userRepository.findById(updateUserRoleDto.user_id);

      return UserInfoResponseDto.of(updated_user);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }
}
