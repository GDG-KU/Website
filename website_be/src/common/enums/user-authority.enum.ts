import { BadRequestException } from "@nestjs/common";

export enum AuthorityEnum {
  PointManager = 1,
  CalendarManager = 2,
  AttendanceManager = 3,
  RoleManager = 4,
  AuthorityManager = 5
}

export function getAuthorityIdByName(authorityName: string): number {
  const matchedAuthority = AuthorityEnum[authorityName as keyof typeof AuthorityEnum];

  if (!matchedAuthority) {
    throw new BadRequestException(`Invalid authority: ${authorityName}. Authority must be one of ${Object.keys(AuthorityEnum).filter((key) => isNaN(Number(key))).join(', ')}`);
  }
  return matchedAuthority;
}