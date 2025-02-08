import { ApiProperty } from '@nestjs/swagger';

export class FaqResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
