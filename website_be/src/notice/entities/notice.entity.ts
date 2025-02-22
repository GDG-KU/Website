import { Role } from "src/user/entities/role.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'notice', name: 'notice' })
export class Notice {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'title', type : 'varchar', length : 64, nullable : false})
    title: string;

    @Column({name : 'content', type : 'varchar', length : 2048})
    content: string;

    @ManyToOne(() => User, user => user.notices, {nullable : false})
    @JoinColumn({name : 'user_id'})
    user: User;

    @CreateDateColumn({name : 'created_at', type : 'timestamp'})
    created_at: Date;
}
