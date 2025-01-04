import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Event } from "./event.entity";

@Entity({ schema: 'tag', name: 'tag' })
export class Tag {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'tag', type : 'varchar', length : 64})
    tag: string;

    @OneToMany(() => Event, event => event.tag, {cascade : true})
    events: Event[];
}