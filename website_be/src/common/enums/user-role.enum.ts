import { BadRequestException } from "@nestjs/common";

export enum Role {
    organizer = 1,
    lead = 2,
    core = 3,
    devrel = 4,
    member= 5,
    junior = 6,
    guest = 7,
}


export function getRoleByName(roleName: string): number {
    const matchedRole = Role[roleName as keyof typeof Role];
  
    if (!matchedRole) {
      throw new BadRequestException(`Invalid role: ${roleName}. Role must be one of ${Object.keys(Role).filter((key) => isNaN(Number(key))).join(', ')}`);
    }
    return matchedRole;
  }