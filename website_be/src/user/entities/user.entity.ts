import { Notice } from "src/notice/entities/notice.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Authority } from "./authority.entity";
import { Role } from "./role.entity";
import { Tag } from "src/event/entities/tag.entity";

@Entity({ schema: 'user', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'email', type : 'varchar'})
    email: string;

    @Column({name : 'nickname', type : 'varchar'})
    nickname: string;

    @OneToMany(() => Notice, notice => notice.user)
    notices: Notice[];

    @ManyToMany(() => Authority, authority => authority.users)
    @JoinTable({name : 'user_authority'})
    authoritys: Authority[];

    @ManyToMany(() => Role, role => role.users)
    @JoinTable({name : 'user_role'})
    roles: Role[];

    @Column({name : 'refresh_token', type : 'varchar', nullable : true})
    refresh_token: string;

    @Column({name : 'point', type : 'int', default : 0})
    point: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToMany(() => Tag, tag => tag.users)
    @JoinTable({name : 'user_tag'})
    tags: Tag[];
}
