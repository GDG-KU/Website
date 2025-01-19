import { Body, Controller, Get, Param, Put, Req, UseGuards} from "@nestjs/common";
import { MypageService } from "./service/mypage.service";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { MypageProfileResponseDto } from "./dto/response/mypage-profile.response.dto";
import { MypageHistoryResponseDto } from "./dto/response/mypage-history.response.dto";
import { User } from "src/user/entities/user.entity";
import { UpdateUserDto } from "./dto/request/mypage-profile.request.dto";
import { JwtAuthGuard } from "src/auth/security/jwt.guard";

@ApiTags("Mypage")
@Controller("mypage")
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token') 
  @Get("profile") 
  @ApiOperation({ summary: "프로필 조회" })
  @ApiResponse({ type: MypageProfileResponseDto })
  async getProfile(@Req() req): Promise<MypageProfileResponseDto> {
    const { user } = req;
    return this.mypageService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard) 
  @ApiBearerAuth('token')
  @Get("history")
  @ApiOperation({ summary: "포인트 히스토리 조회" })
  @ApiResponse({ type: [MypageHistoryResponseDto] })
  async getHistory(@Req() req): Promise<MypageHistoryResponseDto[]> {
    const { user } = req;
    return this.mypageService.getHistory(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('token')
  @Put("profile")
  @ApiOperation({ summary: "프로필 정보수정" })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 업데이트되었습니다.', type: User })
  async updateProfile(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const { user } = req; // Guard에서 인증된 사용자 정보
    return this.mypageService.updateUser(user.id, updateUserDto); // 인증된 사용자 ID 사용
  }
}
