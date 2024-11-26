import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { getRoleByName} from "src/common/enums/user-role.enum";


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

    @ApiProperty({
        example: 'lead',
        description: 'Viewer role',
    })
    @IsOptional()
    @Transform(({ value }) => getRoleByName(value))
    role_id: number;
}