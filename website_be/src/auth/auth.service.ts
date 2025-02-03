import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { TokensResponseDto } from './dto/response/tokens.response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/repository/user.repository';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositroy: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async googleCallback(req): Promise<TokensResponseDto> {
    // 유저 정보가 없으면 에러
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }

    const user = req.user;

    //transaction을 사용하여 유저 정보 저장
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let existingUser = await this.userRepositroy.findByEmail(user.email);

      if (!existingUser) {
        // 최초 가입자일 시 유저 정보 저장
        const newuser = new User();
        newuser.email = user.email;
        newuser.nickname = user.lastName + user.firstName;
        existingUser = await queryRunner.manager.save(User, newuser);
      }

      // access token 생성, refresh token 생성 및 저장
      const access_token = await this.generateAccessToken(existingUser);
      const refresh_token = await this.updateRefresh(
        existingUser.id,
        queryRunner,
      );
      await queryRunner.commitTransaction();
      return { access_token, refresh_token };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async refreshTokens(refresh_token: string): Promise<TokensResponseDto> {
    let payload;

    // refresh token 검증
    try {
      payload = this.jwtService.verify(refresh_token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user_id = payload.id;
    const user = await this.userRepositroy.findById(user_id);

    // 유저 정보가 없거나 refresh token이 일치하지 않으면 에러
    if (
      !user ||
      user.refresh_token !== refresh_token ||
      payload.type !== 'refresh'
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // access token 생성, refresh token 갱신 및 저장
    const access_token = await this.generateAccessToken(user);
    const new_refresh_token = await this.updateRefresh(user_id);

    return { access_token, refresh_token: new_refresh_token };
  }

  private async updateRefresh(
    id: number,
    queryRunner?: QueryRunner,
  ): Promise<string> {
    // payload에 user id와 type을 담아 refresh token 생성
    const payload = { id, type: 'refresh' };

    // refresh token 생성
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });

    // refresh token 저장
    if (queryRunner) {
      await queryRunner.manager.update(User, { id }, { refresh_token });
    } else {
      await this.userRepositroy.update(id, { refresh_token });
    }

    return refresh_token;
  }

  private async generateAccessToken(user: User): Promise<string> {
    // payload에 user id와 type을 담아 access token 생성
    console.log('user : ', user);
    console.log('authoritys : ', user.authoritys);
    const payload = {
      id: user.id,
      type: 'access',
      authorities: user.authoritys?.map((auth) => auth.type),
    };

    // access token 생성
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }
}
