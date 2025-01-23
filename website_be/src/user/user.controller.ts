import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/request/update-user.role.dto';
import { UserInfoResponseDto } from './dto/response/user.response.dto';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';
import { AuthorityGuard } from 'src/auth/security/authority.guard';
import { UpdateUserAuthorityDto } from './dto/request/update-user.authority.dto';
import { SetAuthority } from 'src/auth/security/authority.decorator';


@Controller('user')
@UseGuards(JwtAuthGuard, AuthorityGuard)
@ApiBearerAuth('token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '유저 생성 // 개발용'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("all")
  @ApiOperation({ summary: '모든 유저 조회 // 개발용'})
  findAll() {
    return this.userService.findAll();
  }

  @Patch("role")
  @ApiOperation({ summary: '유저 역할 변경'})
  @SetAuthority('RoleManager')
  @ApiResponse({
    description: '유저 역할 변경 성공',
    type: UserInfoResponseDto,
  })
  updateRoles(@Req() req, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    const { user } = req;
    return this.userService.updateRoles(user, updateUserRoleDto);
  }

  @Patch("authority")
  @ApiOperation({ summary: '유저 권한 변경'})
  @SetAuthority('AuthorityManager')
  @ApiResponse({
    description: '유저 권한 변경 성공',
    type: UserInfoResponseDto,
  })
  updateAuthority(@Req() req, @Body() updateUserAuthorityDto: UpdateUserAuthorityDto) {
    const { user } = req;
    return this.userService.updateAuthorities(user, updateUserAuthorityDto);
  }
}
