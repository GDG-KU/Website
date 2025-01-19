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
  student_number: string;  // 학번 추가

  @ApiProperty({ example: ['BE', 'AI'] })
  position_names: string[];  // 포지션명 추가

  @ApiProperty({ example: 'profile_image_url.jpg' })
  profile_image: string;  // 프로필 이미지 추가

  @ApiProperty({ example: '2025-01-16' })
  join_date: string;  // 가입일
}
