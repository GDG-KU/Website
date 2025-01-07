import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { ApiOperation } from '@nestjs/swagger';


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
}
