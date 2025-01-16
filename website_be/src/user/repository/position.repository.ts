import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Position } from "../entities/position.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class PositionRepository {
  constructor(
    @InjectRepository(Position) private readonly repository: Repository<Position>,
  ) {}

  // 이름으로 포지션 찾기
  async findByName(position_name: string): Promise<Position | undefined> {
    return await this.repository.findOne({ where: { name: position_name } });
  }
}
