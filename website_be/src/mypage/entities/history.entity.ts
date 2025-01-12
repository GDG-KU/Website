import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "history", name: "history" })
export class History {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column({ name: "point_change", type: "int" })
  pointChange: number;

  @Column({ name: "reason", type: "varchar", length: 255 })
  reason: string;

  @Column({ name: "created_at", type: "timestamp" })
  createdAt: Date;
}
