import { BadRequestException } from "@nestjs/common";

export enum Role {
    organizer = 1,
    lead = 2,
    devrel = 3,
    member= 4,
    junior = 5,
    guest = 6,
}


export function getRoleByName(roleName: string): number {
    const matchedRole = Role[roleName as keyof typeof Role];
  
    if (!matchedRole) {
      throw new BadRequestException(`Invalid role: ${roleName}. Role must be one of ${Object.keys(Role).filter((key) => isNaN(Number(key))).join(', ')}`);
    }
    return matchedRole;
  }