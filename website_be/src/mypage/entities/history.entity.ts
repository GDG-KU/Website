import { User } from 'src/user/entities/user.entity';
import {
  BeforeUpdate,
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
  
  @Column({ name: 'reason_date', type: 'varchar', length: 30 })
  reason_date: string; 

  @Column({ name: 'accumulated_point', type: 'int', nullable: false })
  accumulated_point: number;

  @Column({ name: 'is_deleted', type: 'boolean', default: false})
  is_deleted: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

}
