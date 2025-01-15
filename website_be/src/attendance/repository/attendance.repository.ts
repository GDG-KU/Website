import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Attendance } from "../entities/attendance.entity";
import { QueryRunner, Repository } from "typeorm";
import { Event } from "../../event/entities/event.entity";
import { User } from "src/user/entities/user.entity";

@Injectable()
export class AttendanceRepository extends Repository<Attendance> {
  constructor(
    @InjectRepository(Attendance) private readonly repository: Repository<Attendance>,
  ) {
    super(repository.target, repository.manager);
  }

  async findOneByEventAndUser(event_id: number, user_id: number) {
    const queryBuilder = this.repository.createQueryBuilder('attendance');

    queryBuilder.where('attendance.event_id = :event_id', { event_id });
    queryBuilder.andWhere('attendance.user_id = :user_id', { user_id });

    return queryBuilder.getOne();
  }

  async findUsersByEvent(event_id: number) {
    const queryBuilder = this.repository.createQueryBuilder('attendance');

    queryBuilder.leftJoinAndSelect('attendance.user', 'user');
    queryBuilder.where('attendance.event_id = :event_id', { event_id });

    return queryBuilder.getMany();
  }

  async findByEvent(event_id: number) {
    const queryBuilder = this.repository.createQueryBuilder('attendance');

    queryBuilder.leftJoinAndSelect('attendance.user', 'user');
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');
    queryBuilder.where('attendance.event_id = :event_id', { event_id });

    return queryBuilder.getMany();
  }

  async upsertAttendance(event_id: number, user_ids: number[], queryRunner: QueryRunner) {
    try{
      for (const user_id of user_ids) {
        await queryRunner.manager.query(
          `
          INSERT INTO \`attendance\` (\`event_id\`, \`user_id\`)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE \`event_id\` = VALUES(\`event_id\`), \`user_id\` = VALUES(\`user_id\`)
          `,
          [event_id, user_id]
        );
      }
    } catch (err) {
      throw err;
    }
  }
}