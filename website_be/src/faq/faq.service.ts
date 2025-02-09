import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/request/create-faq.dto';
import { UpdateFaqDto } from './dto/request/update-faq.dto'; // 업데이트 기능을 위한 DTO
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  // FAQ 생성
  async createFaq(createFaqDto: CreateFaqDto): Promise<Faq> {
    const faq = this.faqRepository.create(createFaqDto);
    return await this.faqRepository.save(faq);
  }

  // FAQ 하나 조회
  async getFaq(id: number): Promise<Faq> {
    const faq = await this.faqRepository.findOne({
      where: { id },  // `id`를 `where` 객체 내에 지정합니다.
    });
  
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }
    return faq;
  }

  // FAQ 여러 개 조회
  async getAllFaqs(): Promise<Faq[]> {
    return await this.faqRepository.find();
  }

  // FAQ 수정
  async updateFaq(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const faq = await this.getFaq(id);
    faq.question = updateFaqDto.question;
    faq.answer = updateFaqDto.answer;
    return await this.faqRepository.save(faq);
  }
  
  // FAQ 삭제
  async deleteFaq(id: number): Promise<void> {
    const faq = await this.getFaq(id);
    await this.faqRepository.remove(faq);
  }
}
