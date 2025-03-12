import { de } from "@faker-js/faker/.";
import { Test, TestingModule } from "@nestjs/testing";
import { FaqResponseDto } from "src/faq/dto/response/faq.response.dto";
import { FaqService } from "src/faq/faq.service";
import { FaqRepository } from "src/faq/repository/faq.repository";
import { User } from "src/user/entities/user.entity";
import { mockFaqs } from "test/mock/faq.mock";
import { mockUsers } from "test/mock/user.mock";

describe('FaqService', () => {
  let service: FaqService;
  let faqRepository: FaqRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FaqService,
        {
          provide: FaqRepository,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          }
        },
      ]
    }).compile();

    service = module.get<FaqService>(FaqService);
    faqRepository = module.get<FaqRepository>(FaqRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFaq', () => {
    it('should create a faq', async () => {
      const createFaqDto = {
        question: 'question',
        answer: 'answer',
      };
      const user = mockUsers[0];
      const faq = mockFaqs[0];
      const noUserFaq = { ...faq, user: null };

      (faqRepository.create as jest.Mock).mockReturnValueOnce(noUserFaq);
      (faqRepository.save as jest.Mock).mockResolvedValueOnce(faq);

      const result = await service.createFaq(user, createFaqDto);

      expect(faqRepository.create).toHaveBeenCalledWith(createFaqDto);
      expect(faqRepository.save).toHaveBeenCalledWith(faq);
      expect(result).toEqual(FaqResponseDto.of(faq));
    });
  });

  describe('getFaq', () => {
    it('should get a faq', async () => {
      const id = 1;
      const faq = mockFaqs[0];

      (faqRepository.findOne as jest.Mock).mockResolvedValueOnce(faq);

      const result = await service.getFaq(id);

      expect(faqRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['user'],
      });
      expect(result).toEqual(FaqResponseDto.of(faq));
    });

    it('should throw NotFoundException when faq is not found', async () => {
      const id = 1;

      (faqRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.getFaq(id))
        .rejects.toThrow('FAQ with ID 1 not found');
      expect(faqRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['user'],
      });
    });
  });

  describe('getAllFaqs', () => {
    it('should get all faqs', async () => {
      const faqs = mockFaqs;

      (faqRepository.find as jest.Mock).mockResolvedValueOnce(faqs);

      const result = await service.getAllFaqs();

      expect(faqRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(faqs.map(faq => FaqResponseDto.of(faq)));
    });
  });

  describe('updateFaq', () => {
    it('should update a faq', async () => {
      const id = 1;
      const updateFaqDto = {
        question: 'question',
        answer: 'answer',
      };
      const faq = mockFaqs[0];
      faq.user = {
        id: faq.user.id,
        nickname: faq.user.nickname,
      } as User;
      const updatedFaq = { ...faq, ...updateFaqDto };

      jest.spyOn(service, 'getFaq').mockResolvedValueOnce(faq);
      (faqRepository.save as jest.Mock).mockResolvedValueOnce(updatedFaq);

      const result = await service.updateFaq(id, updateFaqDto);

      expect(service.getFaq).toHaveBeenCalledWith(id);
      expect(faqRepository.save).toHaveBeenCalledWith(updatedFaq);
      expect(result).toEqual(FaqResponseDto.of(updatedFaq));
    });
  });

  describe('deleteFaq', () => {
    it('should delete a faq', async () => {
      const id = 1;

      await service.deleteFaq(id);

      expect(faqRepository.delete).toHaveBeenCalledWith(id);
    });
  });
});