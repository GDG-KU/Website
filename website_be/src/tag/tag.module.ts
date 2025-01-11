import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { TagProperty } from "./entities/tag_property.entity";
import { TagRepository } from "./repository/tag.repository";
import { TagService } from "./service/tag.service";
import { TagController } from "./tag.controller";
import { TagPropertyService } from "./service/tag.property.service";
import { TagPropertyRepository } from "./repository/tag.property.repository";
import { TagPropertyController } from "./tag.property.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Tag, TagProperty])],
  controllers: [TagController, TagPropertyController],
  providers: [TagService, TagRepository, TagPropertyService, TagPropertyRepository],
  exports: [TagRepository],
})
export class TagModule {}