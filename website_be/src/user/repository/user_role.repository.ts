import { Injectable } from "@nestjs/common";
import { QueryRunner, Repository } from "typeorm";
import { User_role } from "../entities/user_role.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRoleRepository extends Repository<User_role> {
  constructor(
    @InjectRepository(User_role) private readonly repository: Repository<User_role>,
  ) {
    super(repository.target, repository.manager);
  }

  async saveUserRoles(user_id: number, role_ids: number[], queryRunner: QueryRunner) {
    try {
      for (const role_id of role_ids) {
        await queryRunner.manager.query(
          `
          INSERT INTO \`user_role\` (\`user_id\`, \`role_id\`)
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