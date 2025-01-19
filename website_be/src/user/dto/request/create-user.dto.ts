import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty({
    example: 'gdg@gmail.com',
    description: 'User email address',
  })
  email: string;

  @ApiProperty({
    example: '김구글',
    description: 'Nickname of the user',
  })
  nickname: string;

  @ApiProperty({
    example: '컴퓨터학과',
    description: 'Department of the user',
  })
  department: string;

  @ApiProperty({
    example: '2025320333',
    description: 'Student number of the user',
  })
  student_number: string;

  @ApiProperty({
    example: [1, 4],
    description: 'Array of role ids assigned to the user',
  })
  role_ids: number[];
}
