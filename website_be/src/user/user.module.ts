import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Authority } from './entities/authority.entity';
import { UserRepository } from './user.repository';
import { RoleRepository } from './role.repository';
import { Position } from './entities/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority, Role, Position])],
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository],
  exports: [UserRepository, RoleRepository],
})
export class UserModule {}
