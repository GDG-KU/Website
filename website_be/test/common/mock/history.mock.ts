import { History } from "src/mypage/entities/history.entity";

export const mockHistories: History[] = [
  {
    id: 1,
    point_change: 40,
    role: 'Lead',
    reason: '테스트',
    reason_date: '2021-08-10',
    created_at: new Date("2021-08-14T07:00:00.000Z"),
    is_deleted: false,
    accumulated_point: 40,
  } as History,
  {
    id: 2,
    point_change: -50,
    role: 'Lead',
    reason: '테스트',
    reason_date: '2021-08-11',
    created_at: new Date("2021-08-13T07:00:00.000Z"),
    is_deleted: false,
    accumulated_point: 0,
  } as History,
  {
    id: 3,
    point_change: -50,
    role: 'Lead',
    reason: '테스트',
    reason_date: '2021-08-12',
    created_at: new Date("2021-08-12T07:00:00.000Z"),
    is_deleted: false,
    accumulated_point: 50,
  } as History,
  {
    id: 4,
    point_change: 70,
    role: 'Lead',
    reason: '테스트',
    reason_date: '2021-08-13',
    created_at: new Date("2021-08-11T07:00:00.000Z"),
    is_deleted: false,
    accumulated_point: 100
  } as History,
  {
    id: 5,
    point_change: 30,
    role: 'Lead',
    reason: '테스트',
    reason_date: '2021-08-14',
    created_at: new Date("2021-08-10T07:00:00.000Z"),
    is_deleted: false,
    accumulated_point: 30,
  } as History,
];