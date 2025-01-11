import { ApiProperty } from "@nestjs/swagger";

export class UpdateAttendancesDto {
    @ApiProperty({
        example: [1,2,3],
        description: 'ID',
    })
    attendance_ids: number[];

    @ApiProperty({
        example: [true, false, true],
        description: 'Attendance',
    })
    is_attends: boolean[];

    @ApiProperty({
        example: ['Reason1', 'Reason2', 'Reason3'],
        description: 'Reason',
    })
    reasons: string[];
}