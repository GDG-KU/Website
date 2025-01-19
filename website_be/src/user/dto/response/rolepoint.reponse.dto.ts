import {ApiProperty} from "@nestjs/swagger";
import {UserRole} from "../../entities/user_role.entity";

export class RolePointResponseDto {
  @ApiProperty({
    example: "Role name",
    description: "Role name",
  })
  role: string;

  @ApiProperty({
    example: 0,
    description: "Role point",
  })
  point: number;


  static of(userRole: UserRole): RolePointResponseDto {
    return {
      role: userRole.role.role_type,
      point: userRole.point,
    }
  }
}
