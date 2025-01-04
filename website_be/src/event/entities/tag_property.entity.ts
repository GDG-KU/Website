import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Tag } from "./tag.entity";

@Entity({ schema: 'tag_property', name: 'tag_property' })
export class TagProperty {
    @PrimaryGeneratedColumn({name : 'id', type : 'int'})
    id: number;

    @Column({name : 'tag_property', type : 'varchar', length : 64})
    tag_property: string;

    @OneToMany(() => Tag, tag => tag.tag_property, {cascade : true})
    tags: Tag[];
}