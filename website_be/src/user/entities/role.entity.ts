import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User_role } from "./user_role.entity";


/*
INSERT INTO role (id, role_type) 
VALUES 
(1, 'Organizer'),
(2, 'Lead'),
(3, 'Core'),
(4, 'Devrel'),
(5, 'Member'),
(6, 'Junior'),
(7, 'Guest');
*/

@Entity({ schema: 'role', name: 'role' })
export class Role {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'role_type', type : 'varchar', length : 64, nullable : false})
    role_type: string;

    @OneToMany(() => User_role, user_role => user_role.role)
    user_roles: User_role[];
}