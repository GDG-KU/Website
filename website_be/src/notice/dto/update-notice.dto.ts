import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class UpdateNoticeDto {
    @ApiProperty({
        example: '1',
        description: 'id of the notice',
    })
    @IsNotEmpty()
    id: number;

    @ApiProperty({
        example: 'Notice title',
        description: 'Title of the notice',
    })
    @IsString()
    @IsOptional()
    title: string;
    
    @ApiProperty({
        example: 'Notice content',
        description: 'Content of the notice',
    })
    @IsString()
    @IsOptional()
    content: string;
}