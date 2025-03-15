import { Faq } from "src/faq/entities/faq.entity";
import { mockUsers } from "./user.mock";

export const mockFaqs: Faq[] = [
  {
    id: 1,
    question: 'Question 1',
    answer: 'Answer 1',
    user: mockUsers[0],
    created_at: new Date("2021-08-11T07:00:00.000Z"),
    updated_at: new Date("2021-08-12T07:00:00.000Z"),
  },
  {
    id: 2,
    question: 'Question 2',
    answer: 'Answer 2',
    user: mockUsers[0],
    created_at: new Date("2021-08-12T07:00:00.000Z"),
    updated_at: new Date("2021-08-13T07:00:00.000Z"),
  },
  {
    id: 3,
    question: 'Question 3',
    answer: 'Answer 3',
    user: mockUsers[2],
    created_at: new Date("2021-08-13T07:00:00.000Z"),
    updated_at: new Date("2021-08-14T07:00:00.000Z"),
  },
  {
    id: 4,
    question: 'Question 4',
    answer: 'Answer 4',
    user: mockUsers[2],
    created_at: new Date("2021-08-15T07:00:00.000Z"),
    updated_at: new Date("2021-08-16T07:00:00.000Z"),
  },
]