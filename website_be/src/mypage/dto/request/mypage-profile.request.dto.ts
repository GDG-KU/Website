import { ApiProperty } from "@nestjs/swagger";

export class MypageProfileRequestDto {
  @ApiProperty({
    example: 1,
    description: "User ID",
  })
  userId: number;
}


export class UpdateUserDto {
  @ApiProperty({ example: '변오가', description: '변경 닉네임' })
  nickname: string;
  
  @ApiProperty({ example: '컴퓨터학과', description: '변경 학과' })
  department: string;
  
  @ApiProperty({ example: '2021320001', description: '변경 학번' })
  student_number: string;
  
  @ApiProperty({ example: ['BE', 'AI'], description: '변경 포지션명' })
  position_names: string[];
}