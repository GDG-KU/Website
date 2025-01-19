import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'history', name: 'history' })
export class History {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  user: User;

  @Column({ name: 'point_change', type: 'int', nullable: false })
  pointChange: number;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  role: string;

  @Column({ name: 'reason', type: 'varchar', length: 255 })
  reason: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
