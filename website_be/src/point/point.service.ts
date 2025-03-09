import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRoleRepository } from '../user/repository/user_role.repository';
import { DataSource } from 'typeorm';
import { RolePointResponseDto } from '../user/dto/response/rolepoint.reponse.dto';
import { HistoryRepository } from '../mypage/repository/history.repository';
import { History } from '../mypage/entities/history.entity';
import { UserRepository } from '../user/repository/user.repository';
import { NotFoundError } from 'rxjs';
import { getRoleIdByName } from 'src/common/enums/user-role.enum';

@Injectable()
export class PointService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly historyRepository: HistoryRepository,
    private dataSource: DataSource,
  ) {}

  async getUserPoint(userId: number): Promise<RolePointResponseDto[]> {
    // const userRole = await this.userRoleRepository.find({
    //   where: { user: { id: userId } },
    //   relations: ['role'],
    // });

    const user = await this.userRepository.findById(userId);
    return user.user_roles.map(RolePointResponseDto.of);
  }

  async updateUserPoint(
    userId: number,
    roleId: number,
    point: number,
    reason: string,
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
      history.reason = reason;
      history.accumulated_point = userRole.point;
      await manager.save(history);
      await manager.save(userRole);
    });
    return RolePointResponseDto.of(userRole);
  }

  async restoreOrDelete(historyId: number, is_deleted: boolean): Promise<void> {
    const history = await this.historyRepository.findByIdWithUser(historyId);

    if(!history) {
      throw new NotFoundException('History not found');
    }

    const roleId = getRoleIdByName(history.role);

    const userRole = await this.userRoleRepository.findOne({
      where: {
        user: { id: history.user.id },
        role: { id: roleId },
      },
      relations: ['role', 'user'],
    });

    await this.dataSource.transaction(async (manager) => {
      history.is_deleted = is_deleted;
      userRole.point += is_deleted ? -history.point_change : history.point_change;
      history.accumulated_point = userRole.point;
      await manager.save(userRole);
      await manager.save(history);
    });
  }
}
