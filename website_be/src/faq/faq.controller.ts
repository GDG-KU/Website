import { Controller, Get, Param, Post, Body, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/request/create-faq.dto';
import { UpdateFaqDto } from './dto/request/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthorityGuard } from 'src/auth/security/authority.guard';
import { JwtAuthGuard } from 'src/auth/security/jwt.guard';
import { SetAuthority } from 'src/auth/security/authority.decorator';
import { FaqResponseDto } from './dto/response/faq.response.dto';

@ApiTags('FAQ')
@UseGuards(JwtAuthGuard, AuthorityGuard)
@ApiBearerAuth('token')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @Post()
  @SetAuthority('FaqManager')
  @ApiOperation({ summary: 'FAQ 생성' })
  @ApiResponse({ status: 201, description: 'FAQ가 성공적으로 생성되었습니다.', type: FaqResponseDto })
  async createFaq(@Req() req, @Body() createFaqDto: CreateFaqDto): Promise<FaqResponseDto> {
    const { user } = req;
    return this.faqService.createFaq(user, createFaqDto);
  }

  // FAQ 하나 조회
  @Get(':id')
  @ApiOperation({ summary: 'FAQ 조회' })
  @ApiResponse({ status: 200, description: 'FAQ 조회 성공', type: FaqResponseDto })
  async getFaq(@Param('id') id: number): Promise<FaqResponseDto> {
    return this.faqService.getFaq(id);
  }

  // FAQ 전체 조회
  @Get()
  @ApiOperation({ summary: 'FAQ 전체 조회' })
  @ApiResponse({ status: 200, description: 'FAQ 전체 조회 성공', type: [FaqResponseDto] })
  async getAllFaqs(): Promise<FaqResponseDto[]> {
    return this.faqService.getAllFaqs();
  }

  // FAQ 수정
@Put(':id')
@SetAuthority('FaqManager')
@ApiOperation({ summary: 'FAQ 수정' })
@ApiResponse({ status: 200, description: 'FAQ 수정 성공', type: FaqResponseDto })
async updateFaq(
  @Param('id') id: number,
  @Body() updateFaqDto: UpdateFaqDto,
): Promise<FaqResponseDto> {
  return this.faqService.updateFaq(id, updateFaqDto);
}

  // FAQ 삭제
  @Delete(':id')
  @SetAuthority('FaqManager')
  @ApiOperation({ summary: 'FAQ 삭제' })
  @ApiResponse({ status: 200, description: 'FAQ 삭제 성공' })
  async deleteFaq(@Param('id') id: number): Promise<void> {
    return this.faqService.deleteFaq(id);
  }
}
