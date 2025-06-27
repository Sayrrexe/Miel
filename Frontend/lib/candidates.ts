/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, {AxiosResponse} from "axios";


import {
  CandidateResponse,
  ErrorResponse, ApiResponse
} from "@/types/api";
import {SuccessResponse} from "@/lib/types";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

// Функция для форматирования даты
function formatDate(date: Date | null): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль для месяцев
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль для дней
  return `${year}-${month}-${day}`;
}

type FetchResponse = AxiosResponse<CandidateResponse> | ErrorResponse;

export default async function fetchGetEndpoint<T>(
  endpoint: string,
  token: string,
  start_date?: Value,
  end_date?: Value,
  due_date?: Value,
  search?: string
): Promise<ApiResponse<T> | ErrorResponse> {
  try {
    let url = `https://miel.sayrrx.cfd${endpoint}`;
    const params: string[] = [];

    // Обработка start_date
    if (start_date) {
      if (Array.isArray(start_date)) {
        const [start, startEnd] = start_date;
        if (start) {
          params.push(`start_date=${formatDate(start)}`);
        }
        if (startEnd) {
          params.push(`start_date_end=${formatDate(startEnd)}`);
        }
      } else {
        params.push(`start_date=${formatDate(start_date)}`);
      }
    }

    // Обработка end_date
    if (end_date) {
      if (Array.isArray(end_date)) {
        const [end, endEnd] = end_date;
        if (end) {
          params.push(`end_date=${formatDate(end)}`);
        }
        if (endEnd) {
          params.push(`end_date_end=${formatDate(endEnd)}`);
        }
      } else {
        params.push(`end_date=${formatDate(end_date)}`);
      }
    }

    // Обработка due_date
    if (due_date) {
      if (Array.isArray(due_date)) {
        const [due, dueEnd] = due_date;
        if (due) {
          params.push(`due_date=${formatDate(due)}`);
        }
        if (dueEnd) {
          params.push(`due_date_end=${formatDate(dueEnd)}`);
        }
      } else {
        params.push(`due_date=${formatDate(due_date)}`);
      }
    }

    // Обработка параметра search (если он есть)
    if (search) {
      params.push(`search=${encodeURIComponent(search)}`);
    }

    // Если есть параметры, добавляем их к URL
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log(url);

    const response = await axios.get<T>(url, {
      headers: {
        Authorization: `Token ${token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"}`,
      },
    });

    // Проверяем структуру ответа
    if (!response.data || typeof response.data !== 'object') {
      return {
        success: false,
        error: "Invalid response format",
      } as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as T
    };
  } catch (error) {
    return handleError(error);
  }
}

// Утилита для обработки ошибок
function handleError(error: any): ErrorResponse {
  if (error.response) {
    // Ошибка от сервера
    return {
      error: `HTTP ${error.response.status}: ${error.response.statusText}`,
      details: error.response.data,
    };
  } else if (error.request) {
    // Ошибка при отправке запроса
    return {
      error: "No response received from the server.",
    };
  } else {
    // Другое исключение
    return {
      error: error.message,
    };
  }
}

// Функция для обработки POST запросов
export async function fetchPostEndpoint<T>(
  endpoint: string,
  body: Record<string, any>,
  token: string
): Promise<ApiResponse<T> | ErrorResponse> {
  try {
    const response = await axios.post<T>(
      `https://miel.sayrrx.cfd${endpoint}`,
      body,
      {
        headers: {
          Authorization: `Token ${
            token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    // Проверяем структуру ответа
    if (!response.data || typeof response.data !== 'object') {
      return {
        success: false,
        error: "Invalid response format",
      } as ErrorResponse;
    }

    return {
      success: true,
      data: response.data as T
    };
  } catch (error) {
    return handleError(error);
  }
}

// Функция для авторизации (POST запрос)
export async function fetchAuthorisation(
  endpoint: string,
  body: any
): Promise<any | ErrorResponse> {
  try {
    const response = await axios.post(
      `https://miel.sayrrx.cfd${endpoint}`,
      body,
      {
        headers: {
          "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
        },
      }
    );

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchDelete(
  endpoint: string,
  token: string // Добавим параметр для токена
): Promise<any | { error: string }> {
  try {
    const response = await axios.delete(`https://miel.sayrrx.cfd${endpoint}`, {
      headers: {
        Authorization: `Token ${
          token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
        "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
      },
    });

    return response.data; // Возвращаем данные из ответа
  } catch (error: any) {
    return {error: error.message || "Unknown error"}; // Обрабатываем ошибку и возвращаем объект с полем error
  }
}

export async function fetchPatchEndpoint(
  endpoint: string,
  body: Record<string, any>,
  token: string
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const response = await axios.patch<SuccessResponse>(
      `https://miel.sayrrx.cfd${endpoint}`,
      body,
      {
        headers: {
          Authorization: `Token ${
            token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
          }`,
          "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
        },
      }
    );

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    return handleError(error);
  }
}

// Функция для получения кандидатов с параметрами фильтрации
export async function fetchGetCandidates(
  endpoint: string,
  token: string,
  age_max?: number,
  age_min?: number,
  by_new?: boolean,
  courses?: string[] // Параметр courses теперь массив строк
): Promise<FetchResponse> {
  try {
    let url = `https://miel.sayrrx.cfd${endpoint}`;
    const params: string[] = [];

    // Проверка age_max, добавляем параметр, если он не равен 0
    if (age_max && age_max !== 0) {
      params.push(`age_max=${age_max}`);
    }

    // Проверка age_min, добавляем параметр, если он не равен 0
    if (age_min && age_min !== 0) {
      params.push(`age_min=${age_min}`);
    }

    // Проверка by_new, добавляем параметр, если он не undefined
    if (by_new !== undefined) {
      params.push(`by_new=${by_new}`);
    }

    // Обрабатываем параметр courses, если он есть и не пустой
    if (courses && courses.length > 0) {
      courses.forEach((course) => {
        if (course) {
          params.push(`courses=${encodeURIComponent(course)}`);
        }
      });
    }

    // Если есть параметры, добавляем их к URL
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    console.log(url); // Логируем финальный URL для отладки

    // Выполнение запроса
    const response = await axios.get<SuccessResponse>(url, {
      headers: {
        Authorization: `Token ${
          token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
      },
    });

    return response.data
      ? response
      : {error: "Unexpected response structure"};
  } catch (error) {
    return handleError(error);
  }
}
