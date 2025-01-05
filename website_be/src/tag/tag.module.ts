import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { TagProperty } from "./entities/tag_property.entity";
import { TagRepository } from "./tag.repository";
import { TagService } from "./tag.service";
import { TagController } from "./tag.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagProperty])],
  controllers: [TagController],
  providers: [TagService, TagRepository],
  exports: [TagRepository],
})
export class TagModule {}