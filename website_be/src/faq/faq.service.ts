import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { CreateFaqDto } from './dto/request/create-faq.dto';
import { UpdateFaqDto } from './dto/request/update-faq.dto'; // 업데이트 기능을 위한 DTO
import { NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { FaqResponseDto } from './dto/response/faq.response.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
  ) {}

  // FAQ 생성
  async createFaq(user: User,createFaqDto: CreateFaqDto): Promise<FaqResponseDto> { 
    const faq = this.faqRepository.create(createFaqDto);
    faq.user = user;
    const savedfaq = await this.faqRepository.save(faq);
    return FaqResponseDto.of(savedfaq);
  }

  // FAQ 하나 조회
  async getFaq(id: number): Promise<FaqResponseDto> {
    const faq = await this.faqRepository.findOne({
      where: { id },  // `id`를 `where` 객체 내에 지정합니다.
      relations: ['user'], // `user` 엔티티를 함께 로드합니다.
    });
  
    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    return FaqResponseDto.of(faq);
  }

  // FAQ 여러 개 조회
  async getAllFaqs(): Promise<FaqResponseDto[]> {
    const faqs: Faq[] = await this.faqRepository.find(
      { relations: ['user'] } // `user` 엔티티를 함께 로드합니다.
    );

    return faqs.map(faq => FaqResponseDto.of(faq));
  }

  // FAQ 수정
  async updateFaq(id: number, updateFaqDto: UpdateFaqDto): Promise<FaqResponseDto> {
    const faq = await this.getFaq(id);
    faq.question = updateFaqDto.question;
    faq.answer = updateFaqDto.answer;
    return await this.faqRepository.save(faq);
  }
  
  // FAQ 삭제
  async deleteFaq(id: number): Promise<void> {
    await this.faqRepository.delete(id);
  }
}
