import axios from "axios";

// Функция для обработки запросов по эндпоинту
export default async function fetchGetEndpoint(endpoint, token) {
  try {
    const response = await axios.get(`http://80.85.246.168${endpoint}`, {
      headers: {
        Authorization: `Token ${
          token ? token : "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
      },
    });

    return response;
  } catch (error) {
    // Логирование ошибки
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
}

export async function fetchPostEndpoint(endpoint, body, token) {
  try {
    const response = await axios.post(`http://80.85.246.168${endpoint}`, body, {
      headers: {
        Authorization: `Token ${
          token ? token : "1a5091d623065bdb3722c62b70a473cfe2b1749f"
        }`,
        "Content-Type": "application/json", // Убедитесь, что сервер ожидает JSON
      },
    });

    return response.data; // Возвращаем данные из ответа
  } catch (error) {
    if (error.response) {
      console.error("Server returned an error response:", error.response);
      return {
        error: `HTTP ${error.response.status}: ${error.response.statusText}`,
        details: error.response.data,
      };
    } else if (error.request) {
      console.error("No response received:", error.request);
      return {
        error: "No response received from the server.",
      };
    } else {
      console.error("Unexpected error:", error.message);
      return {
        error: error.message,
      };
    }
  }
}
