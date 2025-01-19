import {ApiProperty} from "@nestjs/swagger";
import {User_role} from "../../entities/user_role.entity";

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


  static of(userRole: User_role): RolePointResponseDto {
    return {
      role: userRole.role.role_type,
      point: userRole.point,
    }
  }
}
