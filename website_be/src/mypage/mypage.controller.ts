import { Body, Controller, Get, Param, Query, Req, UseGuards, Post, Put, Delete, UploadedFile, UseInterceptors, Patch, BadRequestException } from "@nestjs/common";
import { MypageService } from "./service/mypage.service";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { MypageProfileResponseDto } from "./dto/response/mypage-profile.response.dto";
import { HistoryWithPointResponseDto, MypageHistoryResponseDto } from "./dto/response/mypage-history.response.dto";
import { User } from "src/user/entities/user.entity";
import { UpdateUserDto } from "./dto/request/mypage-profile.request.dto";
import { JwtAuthGuard } from "src/auth/security/jwt.guard";
import { FileInterceptor } from '@nestjs/platform-express';
import { GCPStorageService } from "./service/gcp-storage.service";
import { AuthorityGuard } from "src/auth/security/authority.guard";
import { MypageImageUrlDto } from "./dto/request/mypage-image.request.dto";
import { getRoleIdByName } from "src/common/enums/user-role.enum";


@ApiTags("Mypage")
@Controller("mypage")
@ApiBearerAuth('token') 
@UseGuards(JwtAuthGuard, AuthorityGuard)
export class MypageController {
  constructor(
    private readonly mypageService: MypageService,
    private readonly gcpStorageService: GCPStorageService, 
  ) {}

  @Get("profile") 
  @ApiOperation({ summary: "프로필 조회" })
  @ApiResponse({ type: MypageProfileResponseDto })
  async getProfile(@Req() req): Promise<MypageProfileResponseDto> {
    const { user } = req;
    return this.mypageService.getProfile(user.id);
  }

  @Get("history")
  @ApiOperation({ summary: "포인트 히스토리 조회" })
  @ApiResponse({ type: [HistoryWithPointResponseDto] })
  @ApiQuery({ name: "role", type: String })
  @ApiQuery({ name: "cursor", required: false, type: Number })
  async getHistory(@Req() req, @Query("role") role: string, @Query("cursor") cursor?: number): Promise<HistoryWithPointResponseDto[]> {
    const { user } = req;
    
    // check role is valid
    getRoleIdByName(role);

    return this.mypageService.getHistoryWithAccumulatedPoint(user.id, role, cursor);
  }

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

  /*
  @Post("profile/image")
  @UseInterceptors(FileInterceptor('file')) // 'file' 필드명 확인
  @ApiOperation({ summary: "프로필 이미지 업로드" })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '이미지가 성공적으로 업로드되었습니다.', type: String })
  async uploadProfile(
    @Req() req,
    @UploadedFile() file: Express.Multer.File // Multer 파일 객체
  ) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }
    const user_id = req.user.id;
    const url = await this.gcpStorageService.uploadFile(user_id, file);
    await this.mypageService.updateProfileImage(user_id, url); // 사용자 프로필 이미지 업데이트
    return { url };
  }


  @Delete("profile/image")
  @ApiOperation({ summary: "프로필 이미지 삭제" })
  @ApiResponse({ status: 200, description: '이미지가 성공적으로 삭제되었습니다.' })
  async deleteProfile(@Req() req) {
    const user_id = req.user.id;
    const user = await this.mypageService.getProfile(user_id);
    const fileName = user.profile_image.split('/').pop(); // URL에서 파일명 추출
    await this.gcpStorageService.deleteFile(fileName);
    await this.mypageService.updateProfileImage(user_id, ''); // 이미지 URL 초기화
    return { message: '프로필 이미지가 삭제되었습니다.' };
  }
  */

  @Patch("profile/image")
  @ApiOperation({ summary: "프로필 이미지 수정" })
  @ApiResponse({ status: 200, description: '이미지가 성공적으로 수정되었습니다.', type: String })
  async updateProfileImage( @Req() req, @Body() mypageImageUrlDto : MypageImageUrlDto) {
    // file이 없으면 이미지 삭제
    const user_id = req.user.id;
    const url = mypageImageUrlDto.url;

    this.mypageService.updateProfileImage(user_id, url);
    return { message: '프로필 이미지가 수정되었습니다.' };
  }

  @Delete("profile/image")
  @ApiOperation({ summary: "프로필 이미지 삭제" })
  @ApiResponse({ status: 200, description: '이미지가 성공적으로 삭제되었습니다.' })
  async deleteProfileImage(@Req() req) {
    const user_id = req.user.id;
    this.mypageService.updateProfileImage(user_id, '');
    return { message: '프로필 이미지가 삭제되었습니다.' };
  }


  @Get("profile/image")
  @ApiOperation({ summary: "프로필 이미지 URL 조회" })
  @ApiResponse({ status: 200, description: '프로필 이미지 URL을 반환합니다.', type: String })
  async getProfileUrl(@Req() req) {
    const user_id = req.user.id;
    const user = await this.mypageService.getProfile(user_id);
    return { url: user.profile_image };
  }

  @Get("signedurl")
  @ApiOperation({ summary: "서명된 URL 생성" })
  @ApiResponse({ status: 200, description: '서명된 URL을 반환합니다.', type: String })
  async getSignedUrl(@Req() req) {
    const user_id = req.user.id;
    return this.gcpStorageService.getSignedUrl(user_id);
  }
}