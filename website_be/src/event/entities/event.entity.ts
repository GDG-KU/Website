import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "../../tag/entities/tag.entity";
import { Attendance } from "../../attendance/entities/attendance.entity";

@Entity({ schema: 'event', name: 'event' })
export class Event {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'title', type : 'varchar', length : 64})
    title: string;

    @Column({name : 'start_date', type : 'timestamp'})
    start_date: Date;

    @Column({name : 'end_date', type : 'timestamp'})
    end_date: Date;

    @Column({name : 'location', type : 'varchar', length : 64})
    location: string;

    @Column({name : 'url', type : 'varchar', length : 64})
    url: string;

    @ManyToOne(() => Tag, tag => tag.events)
    @JoinColumn({name : 'tag_id'})
    tag: Tag;

    @OneToMany(() => Attendance, attendance => attendance.event)
    attendances: Attendance[];
}