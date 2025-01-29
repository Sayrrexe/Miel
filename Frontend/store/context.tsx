/* global localStorage, */
"use client";
import { create } from "zustand";
import { useEffect } from "react";

interface user {
  data: {
    username: string;
    password: string;
    role: string;
    full_name: string;
    email: string;
    phone: string;
    office_name?: string;
    office_location?: string;
    department?: string;
    office_quota?: string;
    office_used_quota?: string;
  };
  setUser: (data: {
    username: string;
    password: string;
    role: string;
    full_name: string;
    email: string;
    phone: string;
    office_name?: string;
    office_location?: string;
    department?: string;
    office_quota?: string;
    office_used_quota?: string;
  }) => void;
}

interface token {
  token: string;
  setToken: (token: string) => void;
}

export const useCTokenStore = create<token>()((set) => ({
  token: "", // Изначально пустой токен
  setToken: (token: string) => set({ token }),
}));

// Используем useEffect для установки токена из localStorage
export const useSyncTokenFromLocalStorage = () => {
  const setToken = useCTokenStore((state) => state.setToken);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    }
  }, [setToken]);
};

export const useCategoryStore = create<user>()((set) => ({
  data: {
    username: "",
    password: "",
    role: "",
    full_name: "",
    email: "",
    phone: "",
    office_name: "",
    office_location: "",
    department: "",
    office_quota: "",
    office_used_quota: "",
  },
  setUser: (data: {
    username: string;
    password: string;
    role: string;
    full_name: string;
    email: string;
    phone: string;
    office_name?: string;
    office_location?: string;
    department?: string;
    office_quota?: string;
    office_used_quota?: string;
  }) => set({ data }),
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
    email?: string;
    is_archive: boolean;
    is_free: boolean;
    id?: number;
    name: string;
    office?: number;
    patronymic: string;
    phone: string;
    photo?: string;
    resume: string;
    surname: string;
    office_name: string;
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
    email?: string;
    is_archive: boolean;
    is_free: boolean;
    name: string;
    office?: number;
    patronymic: string;
    phone: string;
    photo?: string;
    resume: string;
    surname: string;
    id?: number;
    office_name: string;
  }) => void;
}

export const useEmployee = create<employee>()((set) => ({
  data: {
    age: 0,
    basic_legal_course: "not_started",
    birth: "",
    city: "",
    clients: 0,
    completed_objects: 0,
    country: "",
    course_mortgage: "not_started",
    course_rieltor_join: "not_started",
    course_taxation: "not_started",
    created_at: "",
    education: "",
    email: "",
    is_archive: false,
    is_free: true,
    name: "",
    patronymic: "",
    phone: "",
    surname: "",
    resume: "",
    office_name: "",
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
    email?: string;
    is_archive: boolean;
    is_free: boolean;
    name: string;
    office?: number;
    patronymic: string;
    phone: string;
    photo?: string;
    resume: string;
    surname: string;
    id?: number;
    office_name: string;
  }) => set({ data }),
}));
interface Candidate {
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
  email?: string;
  is_archive: boolean;
  is_free: boolean;
  id?: number;
  name: string;
  office?: number;
  patronymic: string;
  phone: string;
  photo?: string;
  resume: string;
  surname: string;
  office_name: string;
}

interface CandidatesState {
  data: Candidate[];
  setCandidates: (data: Candidate[]) => void;
}

export const useCandidates = create<CandidatesState>((set) => ({
  data: [],
  setCandidates: (data) => set({ data }),
}));
