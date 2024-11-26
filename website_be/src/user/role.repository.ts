import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "./entities/role.entity";

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(
    @InjectRepository(Role) private readonly repository: Repository<Role>,
  ) {
    super(repository.target, repository.manager);
  }

  async findById(id: number){
    return await this.repository.findOne({where: {id}});
  }
  
}