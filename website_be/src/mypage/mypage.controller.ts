import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { MypageService } from "./service/mypage.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MypageProfileResponseDto } from "./dto/response/mypage-profile.response.dto";
import { MypageHistoryResponseDto } from "./dto/response/mypage-history.response.dto";
import { User } from "src/user/entities/user.entity";
import { UpdateUserDto } from "./dto/request/mypage-profile.request.dto";

@ApiTags("Mypage")
@Controller("mypage")
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get(":userId/profile")
  @ApiOperation({ summary: "프로필 조회" })
  @ApiResponse({ type: MypageProfileResponseDto })
  async getProfile(@Param("userId") userId: number) {
    return this.mypageService.getProfile(userId);
  }

  @Get(":userId/history")
  @ApiOperation({ summary: "포인트 히스토리 조회" })
  @ApiResponse({ type: [MypageHistoryResponseDto] })
  @ApiQuery({ name: "cursor_id", required: false, type: Number })
  async getHistory(@Param("userId") userId: number, @Query("cursor_id") cursor_id?: number) {
    return this.mypageService.getHistory(userId, cursor_id);
  }

  @Put(':userId/profile') 
  @ApiOperation({ summary: "프로필 정보수정" })
  @ApiResponse({ status: 200, description: '사용자 정보가 성공적으로 업데이트되었습니다.', type: User })
  async updateProfile(
    @Param('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.mypageService.updateUser(userId, updateUserDto);
  }
}
