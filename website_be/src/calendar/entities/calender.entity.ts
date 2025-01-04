import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity({ schema: 'calendar', name: 'calendar' })
export class Calendar {
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

    @ManyToOne(() => Event, event => event.calendars)
    @JoinColumn({name : 'event_id'})
    event: Event;
}