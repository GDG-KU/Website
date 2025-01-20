import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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
      relations: ['user_roles', 'user_roles.role', 'positions']  // 관계 설정
    });
  
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }
  
    // roles가 undefined인 경우 빈 배열로 처리
    const role = user.user_roles.length != 0 
      ? user.user_roles.map(user_role => user_role.role.role_type).join(" / ") 
      : "Role 연결 실패";
  
    // 포지션이 없는 경우 처리
    // const positionName = user.position ? user.position.name : 'No position';
    
    const positionNames = user.positions.map(position => position.name);
    return {
      nickname: user.nickname,
      role: role,
      email: user.email,  // 이메일 추가
      department: user.department || 'No department',  // 학과 추가
      student_number: user.student_number || 'No student number',  // 학번 추가
      //positionName: positionName,  // 포지션명 추가
      position_names: positionNames,  // 포지션명 추가
      profile_image: user.profile_image || 'No profile image',  // 프로필 이미지 추가
      join_date: user.created_at.toISOString().split("T")[0],  // 가입일
    };  

  }
  
  
  
  async getHistory(userId: number, cursor_id?: number): Promise<MypageHistoryResponseDto[]> {
    const limit = 10;
    let cursor = undefined;
    
    if (cursor_id) {
      const history = await this.historyRepository.findById(cursor_id);
      if (!history) {
        throw new NotFoundException('히스토리를 찾을 수 없습니다.');
      }
      cursor = { id: cursor_id, date: history.created_at };
    }

    const histories = await this.historyRepository.findByUserId(userId, limit, cursor);
    return histories.map(history => MypageHistoryResponseDto.of(history));
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
    const position_names = updateUserDto.position_names;
    const positions = await Promise.all(position_names.map(async (position_name) => {
      return await this.positionRepository.findByName(position_name);
    }))

    if (positions.includes(null)) {
      throw new HttpException('포지션을 찾을 수 없습니다.', HttpStatus.BAD_REQUEST);
    }
    
    user.positions = positions;

    return await this.userRepository.save(user);  // 수정된 사용자 정보 저장
  }


}
