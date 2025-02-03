import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Authority } from './entities/authority.entity';
import { UserRepository } from './repository/user.repository';
import { RoleRepository } from './repository/role.repository';
import { Position } from './entities/position.entity';
import { UserRole } from './entities/user_role.entity';
import { UserRoleRepository } from './repository/user_role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority, Role, Position, UserRole])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository, UserRoleRepository],
  exports: [UserRepository, RoleRepository, UserRoleRepository],
})
export class UserModule {}
