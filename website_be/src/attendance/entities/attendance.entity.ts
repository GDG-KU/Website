import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Event } from "../../event/entities/event.entity";

@Entity({ schema: 'attendance', name: 'attendance'})
@Unique(['user', 'event'])
export class Attendance{
  @PrimaryGeneratedColumn({name : 'id', type : 'int'})
  id: number;

  @ManyToOne(() => User, user => user.attendances)
  @JoinColumn({name : 'user_id'})
  user: User;

  @ManyToOne(() => Event, event => event.attendances) 
  @JoinColumn({name : 'event_id'})
  event: Event;

  @Column({name : 'is_attend', type : 'boolean', default : false})
  is_attend: boolean;

  @Column({name : 'reason', type : 'varchar', length : 128, default: ''})
  reason: string;
}