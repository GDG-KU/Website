import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Authority } from './entities/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Authority, Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
