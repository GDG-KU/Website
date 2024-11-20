import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ schema: 'authority', name: 'authority' })
export class Authority {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'type', type : 'varchar', length : 64})
    type: string;

    @ManyToMany(() => User, user => user.authority_id)
    @JoinTable({name : 'user_authority'})
    user_id: User[];
}