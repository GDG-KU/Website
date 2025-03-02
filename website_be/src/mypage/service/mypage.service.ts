import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HistoryRepository } from '../repository/history.repository';
import { UserRepository } from 'src/user/repository/user.repository';
import { MypageProfileResponseDto } from '../dto/response/mypage-profile.response.dto';
import { HistoryWithPointResponseDto, MypageHistoryResponseDto } from '../dto/response/mypage-history.response.dto';
import { UpdateUserDto } from '../dto/request/mypage-profile.request.dto';
import { User } from 'src/user/entities/user.entity';
import { PositionRepository } from 'src/user/repository/position.repository';

@Injectable()
export class MypageService {
  constructor(
    private readonly historyRepository: HistoryRepository,
    private readonly userRepository: UserRepository,
    private readonly positionRepository: PositionRepository,
  ) {}

  async getProfile(userId: number): Promise<MypageProfileResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['user_roles', 'user_roles.role', 'positions'], // 관계 설정
    });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // roles가 undefined인 경우 빈 배열로 처리
    const role =
      user.user_roles.length != 0
        ? user.user_roles
            .map((user_role) => user_role.role.role_type)
            .join(' / ')
        : 'Role 연결 실패';

    // 포지션이 없는 경우 처리
    // const positionName = user.position ? user.position.name : 'No position';

    const positionNames = user.positions.map((position) => position.name);
    return {
      nickname: user.nickname,
      role: role,
      email: user.email, // 이메일 추가
      department: user.department || 'No department', // 학과 추가
      student_number: user.student_number || 'No student number', // 학번 추가
      //positionName: positionName,  // 포지션명 추가
      position_names: positionNames, // 포지션명 추가
      profile_image: user.profile_image, // 프로필 이미지 추가
      join_date: user.created_at.toISOString().split('T')[0], // 가입일
    };
  }


  async getHistoryWithAccumulatedPoint(
    userId: number,
    role: string,
    cursor?: number,
  ): Promise<HistoryWithPointResponseDto[]> {
    const limit = 10;

    const histories = await this.historyRepository.findByUserIdWithRole(
      userId,
      role,
      limit,
      cursor,
    );

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    let point = null;

    for (const relation of user.user_roles) {
      if (relation.role.role_type === role) {
        point = relation.point;
        break;
      }
    }

    if (point === null) {
      throw new BadRequestException('사용자가 해당 role을 가지고 있지 않습니다.');
    }

    const no_point_histories = histories.map((history) => HistoryWithPointResponseDto.of(history));

    return no_point_histories.map((history, index) => {
      if (index === 0) {
        history.accumulated_point = point;
      } else {
        history.accumulated_point = no_point_histories[index - 1].accumulated_point - no_point_histories[index - 1].point_change;
      }
      return history
    });
  }

  async getHistoryWithRole(
    userId: number,
    role: string,
    cursor?: number,
  ): Promise<MypageHistoryResponseDto[]> {
    const limit = 10;

    const histories = await this.historyRepository.findByUserIdWithRole(
      userId,
      role,
      limit,
      cursor,
    );
    return histories.map((history) => MypageHistoryResponseDto.of(history));
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    // 학번 중복 검사
    const existingUserWithStudentNumber =
      await this.userRepository.findByStudentNumber(
        updateUserDto.student_number,
      );
    if (
      existingUserWithStudentNumber &&
      existingUserWithStudentNumber.id !== userId
    ) {
      throw new BadRequestException('이미 사용 중인 학번입니다.');
    }

    user.nickname = updateUserDto.nickname;
    user.department = updateUserDto.department;
    user.student_number = updateUserDto.student_number;

    // position_name을 기반으로 position 업데이트
    const position_names = updateUserDto.position_names;
    const positions = await Promise.all(
      position_names.map(async (position_name) => {
        return await this.positionRepository.findByName(position_name);
      }),
    );

    if (positions.includes(null)) {
      throw new BadRequestException('포지션 정보를 찾을 수 없습니다.');
    }

    user.positions = positions;

    return await this.userRepository.save(user); // 수정된 사용자 정보 저장
  }

  async updateProfileImage(
    userId: number,
    profileImageUrl: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    user.profile_image = profileImageUrl;
    await this.userRepository.save(user);
  }
}
