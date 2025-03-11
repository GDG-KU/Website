import { User } from 'src/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('faq')
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.faqs)
  user: User;  // 작성자

  @Column()
  question: string;  // 질문 내용

  @Column()
  answer: string;  // 답변 내용

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
