import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/request/update-user.role.dto';
import { UserInfoResponseDto } from './dto/response/user.response.dto';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';


@Controller('user')
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @ApiOperation({ summary: '유저 역할 변경'})
  @ApiResponse({
    description: '유저 역할 변경 성공',
    type: UserInfoResponseDto,
  })
  updateRoles(@Req() req, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    const { user } = req;
    return this.userService.updateRoles(user, updateUserRoleDto);
  }

}
