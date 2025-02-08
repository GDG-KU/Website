import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/request/update-user.role.dto';
import { UserInfoPaginatedResponseDto, UserInfoResponseDto } from './dto/response/user.response.dto';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';
import { AuthorityGuard } from 'src/auth/security/authority.guard';
import { UpdateUserAuthorityDto } from './dto/request/update-user.authority.dto';
import { SetAuthority } from 'src/auth/security/authority.decorator';


@Controller('user')
@UseGuards(JwtAuthGuard, AuthorityGuard)
@ApiBearerAuth('token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '유저 조회' })
  @SetAuthority('PointManager', 'CalendarManager', 'AttendanceManager', 'RoleManager', 'AuthorityManager')
  @ApiResponse({
    description: '유저 조회 성공',
    type: [UserInfoPaginatedResponseDto],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'role', required: false, type: String })
  findAll(@Query('page') page: number, @Query('role') role: string): Promise<UserInfoPaginatedResponseDto> {
    return this.userService.findAll(page, role);
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
