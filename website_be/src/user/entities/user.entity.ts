import { Notice } from "src/notice/entities/notice.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Authority } from "./authority.entity";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { Position } from "./position.entity";
import { User_role } from "./user_role.entity";

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
    @JoinTable({name : 'user_authority'})
    authoritys: Authority[];

    @OneToMany(() => User_role, user_role => user_role.user)
    user_roles: User_role[];

    @Column({name : 'refresh_token', type : 'varchar', nullable : true})
    refresh_token: string;

    @Column({name : 'department', type : 'varchar', nullable : true})
    department: string | null;

    @Column({name : 'student_number', type : 'varchar', nullable : true, unique : true})
    student_number: string | null;

    @Column({name : 'profile_image', type : 'varchar', nullable : true})
    profile_image: string;

    @ManyToOne(() => Position, position => position.users)
    @JoinColumn({name : 'position_id'})
    position: Position | null;

    @OneToMany(() => Attendance, attendance => attendance.user)
    attendances: Attendance[];

    @CreateDateColumn({name : 'created_at', type : 'timestamp'})
    created_at: Date;
}
