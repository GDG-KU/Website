import { Injectable } from "@nestjs/common";
import { HistoryRepository } from "../repository/history.repository";
import { UserRepository } from "src/user/user.repository";
import { MypageProfileResponseDto } from "../dto/response/mypage-profile.response.dto";
import { MypageHistoryResponseDto } from "../dto/response/mypage-history.response.dto";
import { UpdateUserDto } from "../dto/request/mypage-profile.request.dto";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class MypageService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getProfile(userId: number): Promise<MypageProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
  
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // roles가 undefined인 경우 빈 배열로 처리
    const role = user.roles ? user.roles.map(role => role.role_type).join(" / ") : "Role 연결 실패";

    return {
      nickname: user.nickname,
      role: role,
      joinDate: user.created_at.toISOString().split("T")[0],
      totalPoints: user.point,
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
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    user.nickname = updateUserDto.nickname; 

    return await this.userRepository.save(user);  
  }



}
