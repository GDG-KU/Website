import { Y } from "@faker-js/faker/dist/airline-BXaRegOM";
import { Test, TestingModule } from "@nestjs/testing";
import { Type } from "class-transformer";
import { mock } from "node:test";
import { getRoleIdByName } from "src/common/enums/user-role.enum";
import { UserInfoResponseDto } from "src/user/dto/response/user.response.dto";
import { User } from "src/user/entities/user.entity";
import { UserRepository } from "src/user/repository/user.repository";
import { UserRoleRepository } from "src/user/repository/user_role.repository";
import { UserService } from "src/user/user.service";
import { mockMemberRole } from "test/mock/role.mock";
import { mockUsers } from "test/mock/user.mock";
import { Any, DataSource } from "typeorm";


describe('UserService', () => {
  let service: UserService;
  let userRepository: UserRepository;
  let user_roleRepository: UserRoleRepository;
  let dataSource: DataSource;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
  };
  
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
            deleteUserRoles: jest.fn(),
          }
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
    user_roleRepository = module.get<UserRoleRepository>(UserRoleRepository);
    dataSource = module.get<DataSource>(DataSource);

    jest.clearAllMocks();
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


  describe('updateRoles', () => {
    it('should throw NotFoundException when user not found', async () => {
      const mockAdmin = mockUsers[0];
      const mockUpdateUserRoleDto = { user_id: 100, roles: ['Lead'] };
      (userRepository.findById as jest.Mock).mockResolvedValueOnce(null);

      await expect(service.updateRoles(mockAdmin, mockUpdateUserRoleDto))
        .rejects.toThrow('User not found');
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });


    it('should update user roles', async () => {
      const mockAdmin = mockUsers[0];
      const mockUser = mockUsers[1];
      const mockModifiedUser = {...mockUser};
      mockModifiedUser.user_roles = [mockMemberRole];
      const mockUpdateUserRoleDto = { user_id: mockUser.id, roles: ['Member'] };

      (userRepository.findById as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockModifiedUser);
      (user_roleRepository.saveUserRoles as jest.Mock).mockResolvedValueOnce(null);
      (user_roleRepository.deleteUserRoles as jest.Mock).mockResolvedValueOnce(null);


      const result = await service.updateRoles(mockAdmin, mockUpdateUserRoleDto);

      expect(user_roleRepository.saveUserRoles).toHaveBeenCalledWith(mockUser.id, [5], expect.any(Object));
      expect(user_roleRepository.deleteUserRoles).toHaveBeenCalledWith(mockUser.id, [4], expect.any(Object));
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
      expect(userRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(UserInfoResponseDto.of(mockModifiedUser));
    });


    it('should throw error when admin role is lower than user role', async () => {
      const mockAdmin = mockUsers[1];
      const mockUser = mockUsers[0];
      const mockUpdateUserRoleDto = { user_id: mockUser.id, roles: ['Member'] };

      (userRepository.findById as jest.Mock).mockResolvedValueOnce(mockUser);

      await expect(service.updateRoles(mockAdmin, mockUpdateUserRoleDto))
      .rejects.toThrow('권한이 없습니다.');
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });


    it('should handle transaction correctly', async () => {
      const mockAdmin = mockUsers[0];
      const mockUser = mockUsers[1];
      const mockUpdateUserRoleDto = { user_id: mockUser.id, roles: ['Member'] };

      (userRepository.findById as jest.Mock).mockResolvedValueOnce(mockUser);
      (user_roleRepository.saveUserRoles as jest.Mock).mockRejectedValueOnce(new Error('Save error'));
    
      await expect(service.updateRoles(mockAdmin, mockUpdateUserRoleDto))
        .rejects.toThrow('Save error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

});