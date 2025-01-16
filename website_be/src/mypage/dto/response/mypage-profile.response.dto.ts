import { ApiProperty } from "@nestjs/swagger";
import { RolePointResponseDto } from "src/user/dto/response/rolepoint.reponse.dto";

export class MypageProfileResponseDto {
  @ApiProperty({ example: '김구글' })
  nickname: string;

  @ApiProperty({ example: 'Organizer / Junior' })
  role: string;

  @ApiProperty({ example: 'gdg1@gmail.com' })
  email: string;  // 이메일 추가

  @ApiProperty({ example: 'Computer Science' })
  department: string;  // 학과 추가

  @ApiProperty({ example: '20231234' })
  studentNumber: string;  // 학번 추가

  @ApiProperty({ example: 'Manager' })
  positionName: string;  // 포지션명 추가

  @ApiProperty({ example: 'profile_image_url.jpg' })
  profileImage: string;  // 프로필 이미지 추가

  @ApiProperty({ example: '2025-01-16' })
  joinDate: string;  // 가입일
}
