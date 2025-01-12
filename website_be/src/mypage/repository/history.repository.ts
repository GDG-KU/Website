import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { History } from "../entities/history.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(History) private readonly repository: Repository<History>
  ) {}

  async findByUserId(userId: number) {
    return await this.repository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }
}