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
import { getRoleByName } from '../common/enums/user-role.enum';
import { AuthorityGuard } from '../auth/security/authority.guard';
import { Authority } from '../auth/security/authority.decorator';

@ApiTags('Point')
@Controller('point')
@UseGuards(JwtAuthGuard, AuthorityGuard)
// @UseGuards(AuthorityGuard)
export class PointController {
  constructor(private readonly pointService: PointService) {}

  @Get()
  @ApiBearerAuth('token')
  async getPoint(@Req() req): Promise<RolePointResponseDto[]> {
    const { id } = req.user;
    return this.pointService.getUserPoint(id);
  }

  @Get(':userId')
  @ApiBearerAuth('token')
  @Authority('point')
  async getUserPoint(
    @Req() req,
    @Param('userId') userId: number,
  ): Promise<RolePointResponseDto[]> {
    // console.log('req', req);
    const { id } = req.user;
    return this.pointService.getUserPoint(id);
  }

  @Post()
  @ApiBearerAuth('token')
  async updatePoint(
    @Body() userPoint: UserPointDto,
    @Req() req,
  ): Promise<RolePointResponseDto> {
    const { id } = req.user;
    return this.pointService.updateUserPoint(
      id,
      getRoleByName(userPoint.role),
      userPoint.point,
    );
  }
}
