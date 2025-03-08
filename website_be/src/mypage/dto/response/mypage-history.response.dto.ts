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
    example: "Devrel",
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

  @ApiProperty({
    example: false,
    description: "삭제 여부",
  })
  is_deleted: boolean;


  static of(history: History) {
    const dto = new MypageHistoryResponseDto();
    dto.id = history.id;
    dto.point_change = history.point_change;
    dto.role = history.role;
    dto.reason = history.reason;
    dto.date = history.created_at.toISOString().split('T')[0];
    dto.is_deleted = history.is_deleted;
    return dto;
  }
}

export class HistoryWithPointResponseDto extends MypageHistoryResponseDto {
  @ApiProperty({
    example: 100,
    description: "누적 포인트",
  })
  accumulated_point: number;

  static of(history: History) {
    const dto = new HistoryWithPointResponseDto();
    dto.id = history.id;
    dto.point_change = history.point_change;
    dto.role = history.role;
    dto.reason = history.reason;
    dto.date = history.created_at.toISOString().split('T')[0];
    dto.is_deleted = history.is_deleted;
    dto.accumulated_point = null;
    return dto;
  }
}
