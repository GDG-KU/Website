import { Notice } from "src/notice/entities/notice.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Authority } from "./authority.entity";
import { Role } from "./role.entity";
import { Attendance } from "src/attendance/entities/attendance.entity";
import { Position } from "./position.entity";

@Entity({ schema: 'user', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'email', type : 'varchar', nullable : false})
    email: string;

    @Column({name : 'nickname', type : 'varchar', nullable : false})
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

    @Column({name : 'point', type : 'int', default : 0, nullable : false})
    point: number;

    @Column({name : 'department', type : 'varchar', nullable : false})
    department: string;

    @Column({name : 'student_number', type : 'varchar', nullable : false, unique : true})
    student_number: string;

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
