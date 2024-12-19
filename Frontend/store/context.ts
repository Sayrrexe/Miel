import { create } from "zustand";

interface user {
  data: { username: string; password: string };
  setUser: (data: { username: string; password: string }) => void;
}

export const useCategoryStore = create<user>()((set) => ({
  data: {
    username: "",
    password: "",
  },
  setUser: (data: { username: string; password: string }) => set({ data }),
}));

interface employee {
  data: {
    age: number;
    basic_legal_course: string;
    birth: string;
    city: string;
    clients: number;
    completed_objects: number;
    country: string;
    course_mortgage: string;
    course_rieltor_join: string;
    course_taxation: string;
    created_at: string;
    education: string;
    email: string;
    is_archive: boolean;
    is_free: boolean;
    name: string;
    office: string;
    patronymic: string;
    phone: string;
    photo: string;
    resume: string;
    surname: string;
  };
  setEmployee: (data: {
    age: number;
    basic_legal_course: string;
    birth: string;
    city: string;
    clients: number;
    completed_objects: number;
    country: string;
    course_mortgage: string;
    course_rieltor_join: string;
    course_taxation: string;
    created_at: string;
    education: string;
    email: string;
    is_archive: boolean;
    is_free: boolean;
    name: string;
    office: string;
    patronymic: string;
    phone: string;
    photo: string;
    resume: string;
    surname: string;
  }) => void;
}

export const useEmployee = create<employee>()((set) => ({
  data: {
    age: 0,
    basic_legal_course: "",
    birth: "",
    city: "",
    clients: 0,
    completed_objects: 0,
    country: "",
    course_mortgage: "",
    course_rieltor_join: "",
    course_taxation: "",
    created_at: "",
    education: "",
    email: "",
    is_archive: false,
    is_free: false,
    name: "",
    office: "",
    patronymic: "",
    phone: "",
    photo: "",
    resume: "",
    surname: "",
  },
  setEmployee: (data: {
    age: number;
    basic_legal_course: string;
    birth: string;
    city: string;
    clients: number;
    completed_objects: number;
    country: string;
    course_mortgage: string;
    course_rieltor_join: string;
    course_taxation: string;
    created_at: string;
    education: string;
    email: string;
    is_archive: boolean;
    is_free: boolean;
    name: string;
    office: string;
    patronymic: string;
    phone: string;
    photo: string;
    resume: string;
    surname: string;
  }) => set({ data }),
}));
