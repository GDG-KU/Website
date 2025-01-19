import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { HistoryRepository } from "../repository/history.repository";
import { UserRepository } from "src/user/repository/user.repository";
import { MypageProfileResponseDto } from "../dto/response/mypage-profile.response.dto";
import { MypageHistoryResponseDto } from "../dto/response/mypage-history.response.dto";
import { UpdateUserDto } from "../dto/request/mypage-profile.request.dto";
import { User } from "src/user/entities/user.entity";
import { PositionRepository } from "src/user/repository/position.repository";

@Injectable()
export class MypageService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly positionRepository: PositionRepository
  ) {}

  async getProfile(userId: number): Promise<MypageProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_roles', 'user_roles.role', 'position']  // 관계 설정
    });
  
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
  
    // roles가 undefined인 경우 빈 배열로 처리
    const role = user.user_roles.length != 0 
      ? user.user_roles.map(user_role => user_role.role.role_type).join(" / ") 
      : "Role 연결 실패";
  
    // 포지션이 없는 경우 처리
    const positionName = user.position ? user.position.name : 'No position';
  
    return {
      nickname: user.nickname,
      role: role,
      email: user.email,  // 이메일 추가
      department: user.department || 'No department',  // 학과 추가
      studentNumber: user.student_number || 'No student number',  // 학번 추가
      positionName: positionName,  // 포지션명 추가
      profileImage: user.profile_image || 'No profile image',  // 프로필 이미지 추가
      joinDate: user.created_at.toISOString().split("T")[0],  // 가입일
    };  

  }
  
  
  
  async getHistory(userId: number): Promise<MypageHistoryResponseDto[]> {
    const histories = await this.historyRepository.findByUserId(userId);
    let accumulatedPoints = 0;

    return histories.map((history) => {
      accumulatedPoints += history.pointChange;
      return {
        date: history.createdAt.toISOString().split("T")[0],
        pointChange: history.pointChange,
        accumulatedPoints,
        reason: history.reason,
      };
    });
  }

  
  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }

    // 학번 중복 검사
    const existingUserWithStudentNumber = await this.userRepository.findByStudentNumber(updateUserDto.student_number);
    if (existingUserWithStudentNumber && existingUserWithStudentNumber.id !== userId) {
      throw new HttpException('이미 존재하는 학번입니다. 다른 학번을 입력해주세요.', HttpStatus.BAD_REQUEST);
    }

    user.nickname = updateUserDto.nickname;
    user.department = updateUserDto.department;
    user.student_number = updateUserDto.student_number;

    // position_name을 기반으로 position 업데이트
    const position = await this.positionRepository.findByName(updateUserDto.position_name);

    if (position) {
      user.position = position;  // position 객체를 할당
    } else {
      throw new HttpException('유효한 포지션을 찾을 수 없습니다.', HttpStatus.BAD_REQUEST);
    }

    return await this.userRepository.save(user);  // 수정된 사용자 정보 저장
  }


}
