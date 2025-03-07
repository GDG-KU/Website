import { Test, TestingModule } from "@nestjs/testing";
import { getRoleIdByName } from "src/common/enums/user-role.enum";
import { UserInfoResponseDto } from "src/user/dto/response/user.response.dto";
import { UserRepository } from "src/user/repository/user.repository";
import { UserRoleRepository } from "src/user/repository/user_role.repository";
import { UserService } from "src/user/user.service";
import { mockUsers } from "test/mock/user.mock";
import { DataSource } from "typeorm";



describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let user_roleRepository: UserRoleRepository;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
          }
        },
        {
          provide: UserRoleRepository,
          useValue: {
            saveUserRoles: jest.fn(),
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn(),
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    user_roleRepository = module.get<UserRoleRepository>(UserRoleRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated user data', async () => {
      const findAllUsers = mockUsers;
      const mockMaxSize = 1;

      (userRepository.findAll as jest.Mock).mockResolvedValueOnce({ users: findAllUsers, max_size: mockMaxSize });
    
      const result = await service.findAll(1);
      
      expect(userRepository.findAll).toHaveBeenCalledWith(1, null);
      expect(result).toEqual({ 
        data: findAllUsers.map(user => UserInfoResponseDto.of(user)), 
        max_size: mockMaxSize
      });
    });

    it('should return paginated user data with specific role', async () => {
      const findAllUsersLeads = [mockUsers[0]];
      const mockMaxSize = 1;
      const RoleName = 'Lead';
      const RoleId = getRoleIdByName(RoleName);

      (userRepository.findAll as jest.Mock).mockResolvedValueOnce({ users: findAllUsersLeads, max_size: mockMaxSize });

      const result = await service.findAll(1, RoleName);
      
      expect(userRepository.findAll).toHaveBeenCalledWith(1, RoleId);
      expect(result).toEqual({ 
        data: findAllUsersLeads.map(user => UserInfoResponseDto.of(user)), 
        max_size: mockMaxSize
      });
    });
  });
});