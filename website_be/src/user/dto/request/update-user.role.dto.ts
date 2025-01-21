import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserRoleDto {
    @ApiProperty({
      example: 1,
      description: "user_id",
    })
    user_id: number;

    @ApiProperty({
      example: ["Core", "Devrel"],
      description: "roles",
    })
    roles: string[];
}