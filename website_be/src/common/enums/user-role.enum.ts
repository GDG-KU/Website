import { BadRequestException } from "@nestjs/common";
import { Role } from "src/user/entities/role.entity";


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

export function getHighestRoleId(role_ids: number[]): number {
  return Math.min(8, ...role_ids);
}
