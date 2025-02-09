import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MypageController } from './mypage.controller';
import { MypageService } from './service/mypage.service';
import { HistoryRepository } from './repository/history.repository';
import { History } from './entities/history.entity';
import { UserModule } from 'src/user/user.module'; // UserModule 임포트
import { PositionRepository } from 'src/user/repository/position.repository';
import { Position } from 'src/user/entities/position.entity';
import { GCPStorageService } from './service/gcp-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([History, Position]), UserModule], // UserModule 추가
  controllers: [MypageController],
  providers: [
    MypageService,
    HistoryRepository,
    PositionRepository,
    GCPStorageService,
  ],
  exports: [HistoryRepository, MypageService],
})
export class MypageModule {}
