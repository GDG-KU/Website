import { faker } from '@faker-js/faker';
import { mock } from 'node:test';
import { mockDevrelRole, mockLeadRole, mockMemberRole, mockOragnizerRole } from './role.mock';
import { r } from '@faker-js/faker/dist/airline-BXaRegOM';
import { User } from 'src/user/entities/user.entity';

/*
export const generateUserMock = (id: number) => {
  return {
    id: id,
    email: faker.internet.email(),
    nickname: faker.person.fullName(),
    refresh_token: faker.string.uuid(),
    department: faker.company.name(),
    student_number: "20" + faker.number.int({ min: 17, max: 25}).toString() + faker.number.int({ min: 100000, max: 999999 }).toString(),
    profile_image: faker.image.avatar(),
    created_at: faker.date.recent(),
    user_roles: generateUserRoleMock(faker.number.int({ min: 1, max: 100 })),
  }
};
*/

export const mockUsers: User[] = [
  {
    id: 1,
    email: "gdgoc@korea.ac.kr",
    nickname: "전성후",
    refresh_token: "b9c3a0d7-3c9d-4f5d-8a5b-6d4e9d3b8f1e",
    department: "컴퓨터학과",
    student_number: "201712345",
    profile_image: "https://cdn.fakercloud.com/avatars/and/f12445.png",
    created_at: new Date("2021-08-10T07:00:00.000Z"),
    user_roles: [mockLeadRole],
  } as User,
  {
    id: 2,
    email: "example@korea.ac.kr",
    nickname: "장원영",
    refresh_token: "b9c3a0d7-fads-4f5d-8a5b-6d4e9d3b8f1e",
    department: "컴퓨터학과",
    student_number: "201812345",
    profile_image: "https://cdn.fakercloud.com/avatars/and/763412.png",
    created_at: new Date("2021-08-10T07:00:00.000Z"),
    user_roles: [mockDevrelRole],
  } as User,
  {
    id: 3,
    email: "test@korea.ac.kr",
    nickname: "변서연",
    refresh_token: "b9c3r23ds-3c9d-4f5d-8a5b-6d4e9d3b8f1e",
    department: "인공지능학과",
    student_number: "201912345",
    profile_image: "https://cdn.fakercloud.com/avatars/and/621732.png",
    created_at: new Date("2021-08-10T07:00:00.000Z"),
    user_roles: [mockOragnizerRole],
  } as User,
  {
    id: 4,
    email: "gdgtest@gmail.com",
    nickname: "일드매",
    refresh_token: "b9c3a0d7-3c9d-4f5d-8a5b-523fea3b8f1e",
    department: "컴퓨터학과",
    student_number: "202012345",
    profile_image: "https://cdn.fakercloud.com/avatars/and/1_24234.png",
    created_at: new Date("2021-08-10T07:00:00.000Z"),
    user_roles : [mockMemberRole],
  } as User
]
  