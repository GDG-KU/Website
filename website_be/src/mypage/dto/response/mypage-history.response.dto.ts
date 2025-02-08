import { ApiProperty } from "@nestjs/swagger";
import { History } from "src/mypage/entities/history.entity";

export class MypageHistoryResponseDto {
  @ApiProperty({
    example: 1,
    description: "히스토리 ID",
  })
  id: number;

  @ApiProperty({
    example: 100,
    description: "포인트 증감 값",
  })
  point_change: number;

  @ApiProperty({
    example: "DevRel",
    description: "역할",
  })
  role: string;


  @ApiProperty({
    example: "워크트리 참여",
    description: "포인트 변경 사유",
  })
  reason: string;

  @ApiProperty({
    example: "10",
    description: "누적 포인트",
  })
  accumulated_point: number;

  @ApiProperty({
    example: "2025-01-01",
    description: "포인트 변경 날짜",
  })
  date: string;


  static of(history: History) {
    const dto = new MypageHistoryResponseDto();
    dto.id = history.id;
    dto.point_change = history.point_change;
    dto.role = history.role;
    dto.reason = history.reason;
    dto.accumulated_point = history.accumulated_point;
    dto.date = history.created_at.toISOString().split('T')[0];
    return dto;
  }
}
