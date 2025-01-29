/* eslint-disable @typescript-eslint/no-explicit-any */

import axios, { AxiosResponse } from "axios";

// Тип для пользователя
interface User {
  first_name: string;
  username: string;
  patronymic: string;
  phone: string;
  email: string;
  office: string;
}

// Тип для элемента в ответе (кандидат)
interface Candidate {
  index: number;
  photo: string;
  user: User; // Один пользователь
}

// Тип для успешного ответа
interface SuccessResponse {
  phone: string;
  email: string;
  full_name: string;
  role: string;
  data: Candidate[]; // Массив кандидатов
}

// Тип для ошибки
interface ErrorResponse {
  error: string;
  details?: any;
}

interface SuccessResponse {
  total_created: number;
  total_completed: number;
  total_deleted: number;
  max_created_day: string;
  max_completed_day: string;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// Объединенный тип для ответа (успех или ошибка)
type FetchResponse = AxiosResponse<SuccessResponse> | ErrorResponse;

function formatDate(date: Date | null): string | null {
  if (!date) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Добавляем ведущий ноль для месяцев
  const day = String(date.getDate()).padStart(2, "0"); // Добавляем ведущий ноль для дней
  return `${year}-${month}-${day}`;
}

export default async function fetchGetEndpoint(
  endpoint: string,
  token: string,
  start_date?: Value,
  end_date?: Value,
  due_date?: Value,
  search?: string // Новый необязательный параметр
): Promise<FetchResponse> {
  try {
    let url = `http://80.85.246.168${endpoint}`;
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
      : { error: "Unexpected response structure" }; // Проверка на корректный ответ
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
export async function fetchPostEndpoint(
  endpoint: string,
  body: any,
  token: string
): Promise<any | ErrorResponse> {
  try {
    const response = await axios.post(`http://80.85.246.168${endpoint}`, body, {
      headers: {
        Authorization: `Token ${
          token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
        "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
      },
    });

    return response.data; // Возвращаем данные из ответа
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
    const response = await axios.post(`http://80.85.246.168${endpoint}`, body, {
      headers: {
        "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
      },
    });

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    return handleError(error);
  }
}

export async function fetchDelete(
  endpoint: string,
  token: string // Добавим параметр для токена
): Promise<any | { error: string }> {
  // Возвращаем объект с ошибкой
  try {
    const response = await axios.delete(`http://80.85.246.168${endpoint}`, {
      headers: {
        Authorization: `Token ${
          token || "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
        "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
      },
    });

    return response.data; // Возвращаем данные из ответа
  } catch (error: any) {
    return { error: error.message || "Unknown error" }; // Обрабатываем ошибку и возвращаем объект с полем error
  }
}
export async function fetchPatchEndpoint(
  endpoint: string,
  body: Record<string, any>,
  token: string
): Promise<SuccessResponse | ErrorResponse> {
  try {
    const response = await axios.patch<SuccessResponse>(
      `http://80.85.246.168${endpoint}`,
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
