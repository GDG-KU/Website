import { faker } from '@faker-js/faker';
import { Role } from 'src/user/entities/role.entity';
import { UserRole } from 'src/user/entities/user_role.entity';

/*
export const generateRoleMock = (id: number) => {
  return {
    id: id,
    role_type: ['Organizer', 'Lead', 'Core', 'Devrel', 'Member', 'Junior', 'Guest'][id],
  }
};

export const generateUserRoleMock = (id: number) => {
  return {
    id: id,
    point: faker.number.int({ min: 0, max: 100 }),
    role: generateRoleMock(faker.number.int({ min: 1, max: 7 })),
  }
}*/

export const mockOragnizerRole: UserRole = {
  id: 1,
  point: 50,
  role:  {  
    id: 1,
    role_type: 'Organizer',
  } as Role
} as UserRole;

export const mockLeadRole: UserRole = {
  id: 2,
  point: 40,
  role:  {
    id: 2,
    role_type: 'Lead',
  } as Role
} as UserRole;

export const mockCoreRole: UserRole = {
  id: 3,
  point: 30,
  role:  {
    id: 3,
    role_type: 'Core',
  } as Role
} as UserRole;  

export const mockDevrelRole: UserRole = {
  id: 4,
  point: 20,
  role:  {
    id: 4,
    role_type: 'Devrel',
  } as Role
} as UserRole;

export const mockMemberRole: UserRole = {
  id: 5,
  point: 10,
  role:  {
    id: 5,
    role_type: 'Member',
  } as Role
} as UserRole;

export const mockJuniorRole: UserRole = {
  id: 6,
  point: 5,
  role:  {
    id: 6,
    role_type: 'Junior',
  } as Role
} as UserRole;

export const mockGuestRole: UserRole = {
  id: 7,
  point: 0,
  role:  {
    id: 7,
    role_type: 'Guest',
  } as Role
} as UserRole;
