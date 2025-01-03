import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UserRepository } from "src/user/user.repository";
import {ExtractJwt, Strategy, VerifiedCallback} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    })
  }

  async validate(payload: Payload, done: VerifiedCallback): Promise<void> {
    const { id, type } = payload
    const user = await this.userRepository.findById(id)
    
    if (!user) {
      done(new UnauthorizedException({ message: '회원 존재하지 않음.' }), null);
    }
    if (type != 'access') {
      done(new UnauthorizedException({ message: '잘못된 토큰 타입.' }), null);
    }

    return done(null, user);
  }
}

export interface Payload {
  id: number;
  type: string;
}