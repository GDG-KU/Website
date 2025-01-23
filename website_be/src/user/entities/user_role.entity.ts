import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Role } from "./role.entity";

@Entity({ schema: 'user_role', name: 'user_role' })
export class UserRole{
  @PrimaryGeneratedColumn({name : 'id', type : 'int'})
  id: number;

  @ManyToOne(() => User, user => user.user_roles, {nullable : false, onDelete : 'CASCADE', cascade : true})
  @JoinColumn({name : 'user_id'})
  user: User;

  @ManyToOne(() => Role, role => role.user_roles, {nullable : false, onDelete : 'CASCADE', cascade : true})
  @JoinColumn({name : 'role_id'})
  role: Role;

  @Column({name : 'point', type : 'int', default : 0, nullable : false})
  point: number;
}