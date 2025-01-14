import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


/*
INSERT INTO position (id, name)
VALUES 
(1, 'FE'),
(2, 'BE'),
(3, 'AI'),
(4, 'DSGN');
*/

@Entity({ schema: 'position', name: 'position' })
export class Position {
  @PrimaryGeneratedColumn({name : 'id', type : 'int'})
  id: number;

  @Column({name : 'name', type : 'varchar', length : 64, nullable : false})
  name: string;

  @OneToMany(() => User, user => user.position)
  users: User[];
}