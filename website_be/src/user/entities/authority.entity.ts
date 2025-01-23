import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";


/*
INSERT INTO authority (id, type) 
VALUES 
(1, 'PointManager'),
(2, 'CalendarManager'),
(3, 'AttendanceManager'),
(4, 'RoleManager'),
(5, 'AuthorityManager');
*/
@Entity({ schema: 'authority', name: 'authority' })
@Unique(['type'])
export class Authority {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'type', type : 'varchar', length : 64, nullable : false})
    type: string;

    @ManyToMany(() => User, user => user.authoritys)
    @JoinTable({name : 'user_authority'})
    users: User[];
}