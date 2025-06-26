// types.ts
/* Собираем тут интерфейсы типов. Что-то ещё используется в самих файлах и candidates.ts
* Нужно рефакторить */

export interface User {
  first_name: string;
  username: string;
  patronymic: string;
  phone: string;
  email: string;
  office: string;
}

export interface Candidate {
  index: number;
  photo: string;
  user: User;
}

export interface SuccessResponse {
  phone: string;
  email: string;
  full_name: string;
  role: string;
  data: Candidate[];
}

export interface TodoStatsResponse {
  total_created: number;
  total_completed: number;
  total_deleted: number;
  max_created_day: string;
  max_completed_day: string;
}