import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorityGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 메타데이터에서 요구하는 역할 가져오기
    const requiredAuthority = this.reflector.get<string[]>(
      'authorities',
      context.getHandler(),
    );
    if (!requiredAuthority) {
      return true; // 역할 요구사항이 없으면 접근 허용
    }

    console.log('requiredAuthority', requiredAuthority);

    // 요청에서 사용자 정보 가져오기
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('req : ', request);
    console.log('authorities guard', user);
    if (!user || !user.authoritys) {
      throw new ForbiddenException('Access denied: User has no authoritys');
    }

    // 사용자 역할과 요구 역할 비교
    const hasAuthority = requiredAuthority.some((authority) =>
      user.authoritys.map((auth) => auth.type).includes(authority),
    );
    if (!hasAuthority) {
      throw new ForbiddenException('Access denied: Insufficient authority');
    }

    return true; // 조건 만족 시 접근 허용
  }
}
