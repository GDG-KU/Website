import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserRoleRepository } from './repository/user_role.repository';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserRoleDto } from './dto/request/update-user.role.dto';
import { checkRoleHigher, getRoleIdByName } from 'src/common/enums/user-role.enum';
import { UserInfoResponseDto } from './dto/response/user.response.dto';
import { UpdateUserAuthorityDto } from './dto/request/update-user.authority.dto';
import { UserAuthorityResponseDto } from './dto/response/user.authority.response.dto';
import { Authority } from './entities/authority.entity';
import { getAuthorityIdByName } from 'src/common/enums/user-authority.enum';


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
    const user = await this.userRepository.findById(updateUserRoleDto.user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { roles } = updateUserRoleDto;
    const role_ids = roles.map(role => getRoleIdByName(role));

    const insert_role_ids = role_ids.filter(role_id => !user.user_roles.some(user_role => user_role.role.id === role_id));
    const delete_role_ids = user.user_roles.filter(user_role => !role_ids.some(role_id => user_role.role.id === role_id)).map(user_role => user_role.role.id);
    
    const admin_role_ids = admin.user_roles.map(user_role => user_role.role.id);
    const user_role_ids = user.user_roles.map(user_role => user_role.role.id);
    checkRoleHigher(admin_role_ids, user_role_ids);
    
    // insert 또는 delete하려는 role이 admin의 가장 높은 role보다 높으면 권한이 없음
    checkRoleHigher(admin_role_ids, insert_role_ids);
    checkRoleHigher(admin_role_ids, delete_role_ids);
    
    
    const queryRunner = this.dataSources.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      await this.user_roleRepository.saveUserRoles(user.id, insert_role_ids, queryRunner);
      await this.user_roleRepository.deleteUserRoles(user.id, delete_role_ids, queryRunner);

      await queryRunner.commitTransaction();
  
      const updated_user = await this.userRepository.findById(updateUserRoleDto.user_id);

      // 프론트에서 권한 부여 추가시 지워질 코드
      // Core 이상은 모든 권한 부여여
      if(Math.max(...user_role_ids) <= 3){
        this.updateAuthorities(admin, {user_id: user.id, authorities: ['PointManager', 'CalendarManager', 'AttendanceManager', 'RoleManager', 'AuthorityManager']});
      }


      return UserInfoResponseDto.of(updated_user);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    }
    finally {
      await queryRunner.release();
    }
  }

  async updateAuthorities(admin: User, updateUserAuthorityDto: UpdateUserAuthorityDto): Promise<UserAuthorityResponseDto> {
    const { user_id, authorities } = updateUserAuthorityDto;

    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const admin_role_ids = admin.user_roles.map(user_role => user_role.role.id);
    const user_role_ids = user.user_roles.map(user_role => user_role.role.id);
    checkRoleHigher(admin_role_ids, user_role_ids);


    const updated_authorities = authorities.map(authority_type => {
      const authority = new Authority();
      authority.type = authority_type;
      authority.id = getAuthorityIdByName(authority_type);
      return authority;
    });

    user.authoritys = updated_authorities;

    const updated_user = await this.userRepository.save(user);

    return UserAuthorityResponseDto.of(updated_user);
  }


}
