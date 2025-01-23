import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { User } from "src/user/entities/user.entity";


export enum RoleEnum {
  Organizer = 1,
  Lead = 2,
  Core = 3,
  Devrel = 4,
  Member= 5,
  Junior = 6,
  Guest = 7,
}


export function getRoleIdByName(roleName: string): number {
  const matchedRole = RoleEnum[roleName as keyof typeof RoleEnum];

  if (!matchedRole) {
    throw new BadRequestException(`Invalid role: ${roleName}. Role must be one of ${Object.keys(RoleEnum).filter((key) => isNaN(Number(key))).join(', ')}`);
  }
  return matchedRole;
}

export function checkRoleHigher(admin_role_ids: number[], user_role_ids: number[]): void {
  const admin_role_id = getHighestRoleId(admin_role_ids);


  // user의 가장 높은 role이 admin의 가장 높은 role보다 높으면 권한이 없음
  const user_role_id = getHighestRoleId(user_role_ids);
  if (admin_role_id > user_role_id) {
    throw new UnauthorizedException('권한이 없습니다.');
  }
}

function getHighestRoleId(role_ids: number[]): number {
  return Math.min(8, ...role_ids);
}
