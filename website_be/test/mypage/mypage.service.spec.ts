import { Test, TestingModule } from "@nestjs/testing";
import { HistoryRepository } from "src/mypage/repository/history.repository";
import { MypageService } from "src/mypage/service/mypage.service";
import { PositionRepository } from "src/user/repository/position.repository";
import { UserRepository } from "src/user/repository/user.repository";
import { mockHistories } from "test/common/mock/history.mock";
import { mockUsers } from "test/common/mock/user.mock";

describe('MypageService', () => {
  let service: MypageService;
  let historyRepository: HistoryRepository;
  let userRepository: UserRepository;
  let positionRepository: PositionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MypageService,
        {
          provide: HistoryRepository,
          useValue: {
            findHistoryWithPoint: jest.fn(),
            findByUserIdWithRole: jest.fn(),
          }
        },
        {
          provide: UserRepository,
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
          }
        },
        {
          provide: PositionRepository,
          useValue: {
            find: jest.fn(),
          }
        },
      ]
    }).compile();

    service = module.get<MypageService>(MypageService);
    historyRepository = module.get<HistoryRepository>(HistoryRepository);
    userRepository = module.get<UserRepository>(UserRepository);
    positionRepository = module.get<PositionRepository>(PositionRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    
    it('should get a profile', async () => {
      const user = mockUsers[0];
      const position_names = ["AI"];

      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.getProfile(user.id);


      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: user.id },
        relations: ['user_roles', 'user_roles.role', 'positions'],
      });
      expect(result).toEqual({
        id: user.id,
        nickname: user.nickname,
        role: 'Lead',
        email: user.email,
        department: user.department,
        student_number: user.student_number,
        position_names: position_names,
        profile_image: user.profile_image,
        join_date: '2021-08-10',
      });
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 100;

      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.getProfile(userId))
        .rejects.toThrow('사용자를 찾을 수 없습니다.');
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['user_roles', 'user_roles.role', 'positions'],
      });
    });

    it('should get a profile with no role, position, department, student_number', async () => {
      const userId = 1;
      const user = {...mockUsers[0]};
      
      user.user_roles = [];
      user.positions = [];
      user.department = null;
      user.student_number = null;

      (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

      const result = await service.getProfile(userId);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['user_roles', 'user_roles.role', 'positions'],
      });
      expect(result).toEqual({
        id: user.id,
        nickname: user.nickname,
        role: 'Role 연결 실패',
        email: user.email,
        department: 'No department',
        student_number: 'No student number',
        position_names: [],
        profile_image: user.profile_image,
        join_date: '2021-08-10',
      });
    });
  });

  describe('getHistoryWithAccumulatedPoint', () => {
    it('should get a history with accumulated point', async () => {
      const userId = 1;
      const mockUser = {...mockUsers[0]};
      const role = 'Lead';
      const cursor = 0;
      const histories = mockHistories.map(({ accumulated_point, ...rest}) => rest);
      const resultHistories = mockHistories.map((history) => {
        const { created_at, ...rest } = history;
        return { ...rest, date: created_at.toISOString().split('T')[0] };
      });
      
      

      (historyRepository.findByUserIdWithRole as jest.Mock).mockResolvedValueOnce(histories);
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(mockUser);

      const result = await service.getHistoryWithAccumulatedPoint(userId, role, cursor);

      expect(historyRepository.findByUserIdWithRole).toHaveBeenCalledWith(userId, role, 10, cursor);
      expect(userRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(resultHistories);
    });
  });
});