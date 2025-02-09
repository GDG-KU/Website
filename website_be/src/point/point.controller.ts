import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PointService } from './point.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/security/jwt.guard';
import { RolePointResponseDto } from '../user/dto/response/rolepoint.reponse.dto';
import { UserPointDto } from './dto/request/user-point.dto';
import { AuthorityGuard } from '../auth/security/authority.guard';
import { getRoleIdByName } from '../common/enums/user-role.enum';
import { SetAuthority } from 'src/auth/security/authority.decorator';
import { MypageHistoryResponseDto } from '../mypage/dto/response/mypage-history.response.dto';
import { MypageService } from '../mypage/service/mypage.service';

@ApiTags('Point')
@Controller('point')
@ApiBearerAuth('token')
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class PointController {
  constructor(
    private readonly pointService: PointService,
    private readonly mypageService: MypageService,
  ) {}

  @Get()
  async getPoint(@Req() req): Promise<RolePointResponseDto[]> {
    const { id } = req.user;
    return this.pointService.getUserPoint(id);
  }

  @Get(':userId')
  @ApiBearerAuth('token')
  async getUserPoint(
    @Req() req,
    @Param('userId') userId: number,
  ): Promise<RolePointResponseDto[]> {
    const { id } = req.user;
    return this.pointService.getUserPoint(id);
  }

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

  @Get('history/:userId')
  @ApiOperation({ summary: '포인트 히스토리 조회' })
  @ApiResponse({ type: [MypageHistoryResponseDto] })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  @SetAuthority('PointManager')
  async getPointHistory(
    @Param('userId') userId: number,
    @Query('role') role?: string,
    @Query('cursor') cursor?: number,
  ): Promise<MypageHistoryResponseDto[]> {
    if (role) {
      getRoleIdByName(role); // for validation
    }
    return this.mypageService.getHistoryWithRole(userId, role, cursor);
  }
}
