import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {
    super(repository.target, repository.manager);
  } 

  async findById(id: number){
    return await this.repository.findOne({where: {id}});
  }

  async findByEmail(email: string){
    return await this.repository.findOne({where: {email}});
  }

  async updateRefreshToken(id: number, refresh_token: string){
    return await this.repository.update(id, {refresh_token});
  }
  
}