import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { MypageModule } from '../mypage/mypage.module';

@Module({
  imports: [TypeOrmModule.forFeature([]), UserModule, MypageModule],
  controllers: [PointController],
  providers: [PointService],
})
export class PointModule {}
