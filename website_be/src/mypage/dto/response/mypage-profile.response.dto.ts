import { ApiProperty } from "@nestjs/swagger";

export class MypageProfileResponseDto {
    @ApiProperty({
        example: "김멤버",
        description: "유저 닉네임",
      })
      nickname: string;
    
      @ApiProperty({
        example: "Member",
        description: "유저 역할",
      })
      role: string;
    
      @ApiProperty({
        example: "2023-01-06",
        description: "가입일",
      })
      joinDate: string;
    
      @ApiProperty({
        example: 500,
        description: "포인트 총합",
      })
      totalPoints: number;
}
