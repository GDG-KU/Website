import { Notice } from "src/notice/entities/notice.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Authority } from "./authority.entity";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { Position } from "./position.entity";
import { UserRole } from "./user_role.entity";
import { Tag } from "src/tag/entities/tag.entity";

@Entity({ schema: 'user', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'email', type : 'varchar', nullable : false, unique : true})
    email: string;

    @Column({name : 'nickname', type : 'varchar', nullable : false})
    nickname: string;

    @OneToMany(() => Notice, notice => notice.user)
    notices: Notice[];

    @ManyToMany(() => Authority, authority => authority.users)
    authoritys: Authority[];

    @OneToMany(() => UserRole, user_role => user_role.user)
    user_roles: UserRole[];

    @Column({name : 'refresh_token', type : 'varchar', nullable : true})
    refresh_token: string;

    @Column({name : 'department', type : 'varchar', nullable : true})
    department: string | null;

    @Column({name : 'student_number', type : 'varchar', nullable : true, unique : true})
    student_number: string | null;

    @Column({name : 'profile_image', type : 'varchar', nullable : true})
    profile_image: string;

    @ManyToMany(() => Position, position => position.users)
    positions: Position[];

    @OneToMany(() => Attendance, attendance => attendance.user)
    attendances: Attendance[];

    @ManyToMany(() => Tag, tag => tag.users)
    tags: Tag[];

    @CreateDateColumn({name : 'created_at', type : 'timestamp'})
    created_at: Date;
}
