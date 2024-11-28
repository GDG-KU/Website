import { Role } from "src/user/entities/role.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: 'notice', name: 'notice' })
export class Notice {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'title', type : 'varchar', length : 64})
    title: string;

    @Column({name : 'content', type : 'varchar', length : 2048})
    content: string;

    @ManyToOne(() => User, user => user.notices)
    @JoinColumn({name : 'user_id'})
    user: User;

    @ManyToOne(() => Role, role => role.notices)
    @JoinColumn({name : 'role_id'})
    role: Role;

    @CreateDateColumn()
    created_at: Date;
}
