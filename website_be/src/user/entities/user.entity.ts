import { Notice } from "src/notice/entities/notice.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Authority } from "./authority.entity";
import { Role } from "./role.entity";

@Entity({ schema: 'user', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'login_id', type : 'varchar'})
    login_id: string;

    @Column({name : 'password', type : 'varchar'})
    password: string;

    @OneToMany(() => Notice, notice => notice.user_id)
    notice_id: Notice[];

    @ManyToMany(() => Authority, authority => authority.user_id)
    @JoinTable({name : 'user_authority'})
    authority_id: Authority[];

    @ManyToMany(() => Role, role => role.user_id)
    @JoinTable({name : 'user_role'})
    role_id: Role[];

    @CreateDateColumn()
    created_at: Date;
}
