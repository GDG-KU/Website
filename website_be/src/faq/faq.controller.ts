import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/request/create-faq.dto';
import { UpdateFaqDto } from './dto/request/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('FAQ')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @Post()
  @ApiOperation({ summary: 'FAQ 생성' })
  @ApiResponse({ status: 201, description: 'FAQ가 성공적으로 생성되었습니다.', type: Faq })
  async createFaq(@Body() createFaqDto: CreateFaqDto): Promise<Faq> {
    return this.faqService.createFaq(createFaqDto);
  }

  // FAQ 하나 조회
  @Get(':id')
  @ApiOperation({ summary: 'FAQ 조회' })
  @ApiResponse({ status: 200, description: 'FAQ 조회 성공', type: Faq })
  async getFaq(@Param('id') id: number): Promise<Faq> {
    return this.faqService.getFaq(id);
  }

  // FAQ 전체 조회
  @Get()
  @ApiOperation({ summary: 'FAQ 전체 조회' })
  @ApiResponse({ status: 200, description: 'FAQ 전체 조회 성공', type: [Faq] })
  async getAllFaqs(): Promise<Faq[]> {
    return this.faqService.getAllFaqs();
  }

  // FAQ 수정
@Put(':id')
@ApiOperation({ summary: 'FAQ 수정' })
@ApiResponse({ status: 200, description: 'FAQ 수정 성공', type: Faq })
async updateFaq(
  @Param('id') id: number,
  @Body() updateFaqDto: UpdateFaqDto,
): Promise<Faq> {
  return this.faqService.updateFaq(id, updateFaqDto);
}

  // FAQ 삭제
  @Delete(':id')
  @ApiOperation({ summary: 'FAQ 삭제' })
  @ApiResponse({ status: 200, description: 'FAQ 삭제 성공' })
  async deleteFaq(@Param('id') id: number): Promise<void> {
    return this.faqService.deleteFaq(id);
  }
}
