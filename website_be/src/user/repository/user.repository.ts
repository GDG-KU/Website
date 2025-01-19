import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateUserDto } from "../dto/request/create-user.dto";

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {
    super(repository.target, repository.manager);
  } 


  async findAll(){
    const queryBuilder = this.repository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');
    return queryBuilder.getMany();
  }

  async findById(id: number){
    const queryBuilder = this.repository.createQueryBuilder('user');
    queryBuilder.leftJoinAndSelect('user.user_roles', 'user_role');
    queryBuilder.leftJoinAndSelect('user_role.role', 'role');
    queryBuilder.where('user.id = :id', {id});
    return queryBuilder.getOne();
  }

  async findByEmail(email: string){
    return await this.repository.findOne({where: {email}});
  }

  async updateRefreshToken(id: number, refresh_token: string){
    return await this.repository.update(id, {refresh_token});
  }
  
  async findByStudentNumber(studentNumber: string) {
    return await this.repository.findOne({ where: { student_number: studentNumber } });
  }
  
}