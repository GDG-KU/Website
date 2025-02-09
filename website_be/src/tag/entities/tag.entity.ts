import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { TagProperty } from "./tag_property.entity";
import { Event } from "../../event/entities/event.entity";

@Entity({ schema: 'tag', name: 'tag' })
@Unique(['title'])
export class Tag {
  @PrimaryGeneratedColumn({name : 'id', type : 'int'})
  id: number;

  @Column({name : 'title', type : 'varchar', length : 64, nullable : false})
  title: string;

  @OneToMany(() => Event, event => event.tag, {cascade : true})
  events: Event[];

  @ManyToOne(() => TagProperty, tag_property => tag_property.tags, {nullable : false})
  @JoinColumn({name : 'tag_property_id'})
  tag_property: TagProperty;

  @ManyToMany(() => User, user => user.tags)
  @JoinTable({
    name : 'user_tag',
    joinColumn : {
      name : 'tag_id',
      referencedColumnName : 'id'
    },
    inverseJoinColumn : {
      name : 'user_id',
      referencedColumnName : 'id'
    }
  })
  users: User[];
}