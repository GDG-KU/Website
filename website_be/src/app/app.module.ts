import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Notice } from 'src/notice/entities/notice.entity';
import { UserModule } from 'src/user/user.module';
import { NoticeModule } from 'src/notice/notice.module';
import { GoogleStrategy } from '../auth/security/google.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { Authority } from 'src/user/entities/authority.entity';
import { Role } from 'src/user/entities/role.entity';
import { Event } from 'src/event/entities/event.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { EventModule } from 'src/event/event.module';
import { TagProperty } from 'src/tag/entities/tag_property.entity';
import { TagModule } from 'src/tag/tag.module';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { MypageModule } from 'src/mypage/mypage.module';
import { History } from 'src/mypage/entities/history.entity'; 
import { Position } from 'src/user/entities/position.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      // extra: {
      //   socketPath: process.env.DB_SOCKETPATH
      // }, 
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Notice, Authority, Role, Event, Tag, TagProperty, Attendance, History, Position], 
      migrations: [__dirname + '/src/migrations/*.ts'],
      autoLoadEntities: true,
      charset: 'utf8mb4',
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
      keepConnectionAlive: true,
      timezone: '+09:00',
    }),
    UserModule,
    NoticeModule,
    AuthModule,
    EventModule,
    TagModule,
    AttendanceModule,
    MypageModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
