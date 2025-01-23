import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PointService } from './point.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/security/jwt.guard';
import { RolePointResponseDto } from '../user/dto/response/rolepoint.reponse.dto';
import { UserPointDto } from './dto/request/user-point.dto';
import { AuthorityGuard } from '../auth/security/authority.guard';
import { getRoleIdByName } from '../common/enums/user-role.enum';
import { SetAuthority } from 'src/auth/security/authority.decorator';

@ApiTags('Point')
@Controller('point')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  async getPoint(@Req() req): Promise<RolePointResponseDto[]> {
    const { id } = req.user;
    return this.pointService.getUserPoint(id);
  }

  // @Get(':userId')
  // @ApiBearerAuth('token')
  // async getUserPoint(
  //   @Req() req,
  //   @Param('userId') userId: number,
  // ): Promise<RolePointResponseDto[]> {
  //   const { id } = req.user;
  //   return this.pointService.getUserPoint(id);
  // }

  @Post()
  @SetAuthority('PointManager')
  async updatePoint(
    @Body() userPoint: UserPointDto,
  ): Promise<RolePointResponseDto> {
    return this.pointService.updateUserPoint(
      userPoint.userId,
      getRoleIdByName(userPoint.role),
      userPoint.point,
    );
  }
}
