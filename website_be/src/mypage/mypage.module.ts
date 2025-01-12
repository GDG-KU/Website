import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MypageController } from "./mypage.controller";
import { MypageService } from "./service/mypage.service";
import { HistoryRepository } from "./repository/history.repository";
import { History } from "./entities/history.entity";
import { UserModule } from "src/user/user.module"; 

@Module({
  imports: [TypeOrmModule.forFeature([History]), UserModule], 
  controllers: [MypageController],
  providers: [MypageService, HistoryRepository], 
})
export class MypageModule {}
