import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Notice } from "src/notice/entities/notice.entity";

@Entity({ schema: 'role', name: 'role' })
export class Role {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'role_type', type : 'varchar', length : 64})
    role_type: string;

    @ManyToMany(() => User, user => user.role_id)
    @JoinTable({name : 'user_role'})
    user_id: User[];

    @OneToMany(() => Notice, notice => notice.role_id)
    notice_id: Notice[];
}