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

    @OneToMany(() => Notice, notice => notice.user)
    notices: Notice[];

    @ManyToMany(() => Authority, authority => authority.users)
    @JoinTable({name : 'user_authority'})
    authoritys: Authority[];

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({name : 'user_role'})
    roles: Role[];

    @CreateDateColumn()
    created_at: Date;
}
