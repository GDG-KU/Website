import { Injectable } from "@nestjs/common";
import { QueryRunner, Repository } from "typeorm";
import { UserRole } from "../entities/user_role.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
  constructor(
    @InjectRepository(UserRole) private readonly repository: Repository<UserRole>,
  ) {
    super(repository.target, repository.manager);
  }

  async saveUserRoles(user_id: number, role_ids: number[], queryRunner: QueryRunner) {
    for (const role_id of role_ids) {
      await queryRunner.manager.query(
        `
        INSERT INTO \`user_role\` (\`user_id\`, \`role_id\`)
        VALUES (?, ?)
        `,
        [user_id, role_id]
      );
    }
  }

  async deleteUserRoles(user_id: number, role_ids: number[], queryRunner: QueryRunner) {
    for (const role_id of role_ids) {
      await queryRunner.manager.query(
        `
        DELETE FROM \`User_role\`
        WHERE \`user_id\` = ? AND \`role_id\` = ?
        `,
        [user_id, role_id]
      );
    }
  }
}