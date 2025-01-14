import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto{
  @ApiProperty({
    example: 'gdg@gmail.com'
  })
  email: string;
  
  @ApiProperty({
    example: '김구글'
  })
  nickname: string;

  @ApiProperty({
    example: '컴퓨터학과'
  })
  department: string;

  @ApiProperty({
    example: '2025320333'
  })
  student_number: string;

  @ApiProperty({
    example: ['1', '4']
  })
  role_ids: number[];
}