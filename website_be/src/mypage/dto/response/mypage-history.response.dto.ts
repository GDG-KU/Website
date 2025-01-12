import { ApiProperty } from "@nestjs/swagger";

export class MypageHistoryResponseDto {
  @ApiProperty({
    example: "2025-01-01",
    description: "포인트 변경 날짜",
  })
  date: string;

  @ApiProperty({
    example: 100,
    description: "포인트 증감 값",
  })
  pointChange: number;

  @ApiProperty({
    example: 600,
    description: "변경 후 누적 포인트",
  })
  accumulatedPoints: number;

  @ApiProperty({
    example: "워크트리 참여",
    description: "포인트 변경 사유",
  })
  reason: string;
}
