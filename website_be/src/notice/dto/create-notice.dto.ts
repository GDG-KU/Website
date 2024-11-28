import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";
import { getRoleByName} from "src/common/enums/user-role.enum";

export class CreateNoticeDto {
    @ApiProperty({
        example: 'Notice title',
        description: 'Title of the notice',
    })
    @IsString()
    @IsNotEmpty()
    title: string;
    
    @ApiProperty({
        example: 'Notice content',
        description: 'Content of the notice',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        example: 'lead',
        description: 'Viewer role',
    })
    @IsNotEmpty()
    @Transform(({ value }) => getRoleByName(value))
    role_id: number;
}
