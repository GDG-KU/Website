import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { TokensResponseDto } from './dto/response/tokens.response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/user/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepositroy: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async googleCallback(req): Promise<TokensResponseDto> {
    // 유저 정보가 없으면 에러
    if (!req.user) {
      throw new UnauthorizedException("User not found");
    }

    const user = req.user;
    const existingUser = await this.userRepositroy.findByEmail(user.email);

    if (!existingUser){
      // 최초 가입자일 시 유저 정보 저장
      const newuser = new User();
      newuser.email = user.email;
      newuser.nickname = user.lastName+user.firstName;
      const existingUser = await this.userRepositroy.save(newuser); 
    }

    // access token 생성, refresh token 생성 및 저장
    const access_token = await this.generateAccessToken(existingUser.id);
    const refresh_token = await this.updateRefresh(existingUser.id);

    return { access_token, refresh_token };
  }

  async refreshTokens(refresh_token: string): Promise<TokensResponseDto> {
    // refresh token 검증
    const payload = this.jwtService.verify(refresh_token, {
      secret: this.configService.get('JWT_SECRET'),
    });

    const user_id = payload.id;
    const user = await this.userRepositroy.findById(user_id);

    // 유저 정보가 없거나 refresh token이 일치하지 않으면 에러
    if(!user || user.refresh_token !== refresh_token || payload.type !== 'refresh'){
      throw new UnauthorizedException('Invalid refresh token');
    }

    // access token 생성, refresh token 갱신 및 저장
    const access_token = await this.generateAccessToken(user_id);
    const new_refresh_token = await this.updateRefresh(user_id);

    return { access_token, refresh_token: new_refresh_token };
  }

  private async updateRefresh(id: number): Promise<string> {
    // payload에 user id와 type을 담아 refresh token 생성
    const payload = { id, type: 'refresh' };

    // refresh token 생성
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });

    // refresh token 저장
    await this.userRepositroy.update(id, { refresh_token });

    return refresh_token;
  }

  private async generateAccessToken(id: number): Promise<string> {
    // payload에 user id와 type을 담아 access token 생성
    const payload = { id, type: 'access' };

    // access token 생성
    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }
}
