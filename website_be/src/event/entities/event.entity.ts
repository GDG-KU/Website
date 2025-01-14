import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "../../tag/entities/tag.entity";
import { Attendance } from "../../attendance/entities/attendance.entity";

@Entity({ schema: 'event', name: 'event' })
export class Event {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'title', type : 'varchar', length : 64, nullable : false})
    title: string;

    @Column({name : 'start_date', type : 'timestamp', nullable : false})
    start_date: Date;

    @Column({name : 'end_date', type : 'timestamp', nullable : false})
    end_date: Date;

    @Column({name : 'location', type : 'varchar', length : 64, nullable : true})
    location: string | null;

    @Column({name : 'url', type : 'varchar', length : 64, nullable : true})
    url: string | null;

    @ManyToOne(() => Tag, tag => tag.events, {nullable : false})
    @JoinColumn({name : 'tag_id'})
    tag: Tag;

    @OneToMany(() => Attendance, attendance => attendance.event)
    attendances: Attendance[];
}