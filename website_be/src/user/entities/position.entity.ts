import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @ManyToMany(() => User, user => user.positions)
  @JoinTable({
    name: 'user_position',
    joinColumn: { name: 'position_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' }
  })
  users: User[];
}