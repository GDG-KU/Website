import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqRepository } from './repository/faq.repository';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/request/create-faq.dto';  // DTO 임포트

@Module({
  imports: [TypeOrmModule.forFeature([Faq])],
  providers: [FaqService, FaqRepository],
  controllers: [FaqController],
  exports: [FaqService]
})
export class FaqModule {}
