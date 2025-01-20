import { Injectable } from '@nestjs/common';
import { UserRoleRepository } from '../user/repository/user_role.repository';
import { DataSource } from 'typeorm';
import { RolePointResponseDto } from '../user/dto/response/rolepoint.reponse.dto';
import { HistoryRepository } from '../mypage/repository/history.repository';
import { History } from '../mypage/entities/history.entity';

@Injectable()
export class PointService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly historyRepository: HistoryRepository,
    private dataSource: DataSource,
  ) {}

  async getUserPoint(userId: number): Promise<RolePointResponseDto[]> {
    const userRole = await this.userRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['role'],
    });
    return userRole.map(RolePointResponseDto.of);
  }

  async updateUserPoint(
    userId: number,
    roleId: number,
    point: number,
  ): Promise<RolePointResponseDto> {
    const userRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: userId },
        role: { id: roleId },
      },
      relations: ['role', 'user'],
    });

    await this.dataSource.transaction(async (manager) => {
      userRole.point += point;
      const history: History = new History();
      history.user = userRole.user;
      history.point_change = point;
      history.role = userRole.role.role_type;
      history.reason = 'todo';
      await manager.save(history);
      await manager.save(userRole);
    });
    return RolePointResponseDto.of(userRole);
  }
}
