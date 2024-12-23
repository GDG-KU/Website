import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { GoogleResponseDto } from './dto/response/google.response.dto';
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

  async googleCallback(req): Promise<GoogleResponseDto> {
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
    console.log(existingUser);

    const access_token = await this.generateAccessToken(existingUser.id);
    console.log(access_token);
    const refresh_token = await this.updateRefresh(existingUser.id);
    console.log(refresh_token);
    return { access_token, refresh_token };
  }

  private async updateRefresh(id: number): Promise<string> {
    const payload = { id, type: 'refresh' };

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
    });

    await this.userRepositroy.update(id, { refresh_token });

    return refresh_token;
  }

  private async generateAccessToken(id: number): Promise<string> {
    const payload = { id, type: 'access' };

    return await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    });
  }
}
