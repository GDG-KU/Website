import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'history', name: 'history' })
export class History {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'point_change', type: 'int', nullable: false })
  point_change: number;

  @Column({ name: 'role', type: 'varchar', length: 30 })
  role: string;

  @Column({ name: 'reason', type: 'varchar', length: 255 })
  reason: string;

  @Column({ name: 'accumulated_point', type: 'int', nullable: false })
  accumulated_point: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
