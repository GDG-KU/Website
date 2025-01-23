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
    const requiredRoles = this.reflector.get<string[]>(
      'authorities',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true; // 역할 요구사항이 없으면 접근 허용
    }

    console.log('requiredRoles', requiredRoles);

    // 요청에서 사용자 정보 가져오기
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log('req : ', request);
    console.log('authorities guard', user);
    if (!user || !user.authoritys) {
      throw new ForbiddenException('Access denied: User has no roles');
    }

    // 사용자 역할과 요구 역할 비교
    const hasRole = requiredRoles.some((role) =>
      user.authoritys.map((auth) => auth.type).includes(role),
    );
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient role');
    }

    return true; // 조건 만족 시 접근 허용
  }
}
