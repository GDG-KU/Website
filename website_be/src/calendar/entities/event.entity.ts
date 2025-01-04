import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Calendar } from "./calender.entity";
import { Tag } from "./tag.entity";
import { User } from "src/user/entities/user.entity";

@Entity({ schema: 'event', name: 'event' })
export class Event {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'title', type : 'varchar', length : 64})
    title: string;

    @OneToMany(() => Calendar, calendar => calendar.event, {cascade : true})
    calendars: Calendar[];

    @ManyToOne(() => Tag, tag => tag.events)
    @JoinColumn({name : 'tag_id'})
    tag: Tag;

    @ManyToMany(() => User, user => user.events)
    @JoinTable({name : 'user_event'})
    users: User[];
}