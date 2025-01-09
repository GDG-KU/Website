import { BadRequestException, Injectable } from '@nestjs/common';
import { AttendanceRepository } from './repository/attendance.repository';
import { AttendanceResponseDto } from './dto/response/attendance.response.dto';
import { UpdateAttendancesDto } from './dto/request/update-attendance.dto';
import { DataSource } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private dataSource: DataSource,
  ) {}

  async getAttendanceByEventId(event_id: number): Promise<AttendanceResponseDto[]> {
    const attendances = await this.attendanceRepository.findByEvent(event_id);
    return attendances.map(attendance => AttendanceResponseDto.of(attendance));
  }

  async updateAttendances(updateAttendancesDto: UpdateAttendancesDto) {
    const {attendance_ids, is_attends, reasons} = updateAttendancesDto;
    
    if (attendance_ids.length !== is_attends.length || attendance_ids.length !== reasons.length) {
      throw new BadRequestException('Invalid request');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try{
      for (let i = 0; i < attendance_ids.length; i++) {
        const {attendance_id, is_attend, reason} = {attendance_id: attendance_ids[i], is_attend: is_attends[i], reason: reasons[i]};
        await queryRunner.manager.update(Attendance, attendance_id, {is_attend, reason});
      }
      await queryRunner.commitTransaction();

      return {message: `Attendances with IDs ${attendance_ids} updated successfully`};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
