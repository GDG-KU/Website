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
    try {
      for (const role_id of role_ids) {
        await queryRunner.manager.query(
          `
          INSERT INTO \`UserRole\` (\`user_id\`, \`role_id\`)
          VALUES (?, ?)
          `,
          [user_id, role_id]
        );
      }
    } catch (err) {
      throw err;
    }
  }
}