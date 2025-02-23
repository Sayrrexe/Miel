"use client";
import { Button, Input } from "@/components/ui";
import fetchGetEndpoint, { fetchPatchEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import css from "./main.module.css";

interface Requests {
  id: number;
  office: string;
  office_name: string;
  amount: number;
  status: string;
}

interface History {
  id: number;
  amount: number;
  status: string;
  created_at: string;
}

interface Details {
  id: number;
  office_info: {
    id: number;
    name: string;
    location: string;
    phone: string;
    quota: number;
    used_quota: number;
    created_at: string;
  };
  history: History[];
}

export const Notifications = () => {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [details, setDetails] = useState<Details | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Requests | null>(null); // Состояние для выбранного запроса
  const token = localStorage.getItem("token") || "";
  const [history, setHistory] = useState<boolean>(false);
  const status = ["waited", "Отклонено", "accepted", "Предоставлено"];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/requests/";
      await console.log(token);
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setRequests(response.data); // Устанавливаем данные в state, это массив объектов типа Requests
        console.log(response.data);
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
    console.log(requests);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRequestClick = (request: Requests) => {
    setSelectedRequest(request); // Устанавливаем выбранный запрос
  };
  const [amount, setAmount] = useState<number | null>(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("modal-backdrop")) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (!selectedRequest) return; // Возвращаемся, если нет выбранного запроса

    console.log(token);
    (async () => {
      const endpointToCall = `/api/admin/requests/${selectedRequest?.id}/details/`;
      await console.log(token);
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && response.data) {
        setDetails(response.data); // Устанавливаем данные в state
        console.log(response.data);
      } else {
        // Обработка ошибки, если response не содержит data
        console.error("Error fetching details:", response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedRequest]);

  return (
    <div
      className={cn(
        `mt-11 ml-10 flex justify-between w-[70vw] ${css.divInput}`
      )}
    >
      <div>
        <p className="text-black text-2xl font-semibold">
          Список запросов квот:
        </p>
        <div className="mt-7">
          {requests.map((request, index) => (
            <div
              key={index}
              onClick={() => handleRequestClick(request)} // Обработчик нажатия
              style={{
                cursor: "pointer",
                marginBottom: "10px",
                border: "1px solid #ccc",
              }}
              className={`rounded-xl py-[10px] px-4 ${
                selectedRequest == request && "bg-[#F6F6F7]"
              }`}
            >
              {request.office_name}
            </div>
          ))}
        </div>
      </div>
      <Toaster />

      {selectedRequest && details && (
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-2">
            <Button
              onClick={async () => {
                try {
                  const result = await fetchPatchEndpoint(
                    `/api/admin/requests/${selectedRequest.id}`,
                    {
                      amount: amount != null ? selectedRequest.amount : amount,
                      status: "accepted",
                    },
                    token
                  );
                  console.log(result); // Устанавливаем ответ в состояние
                  if ("error" in result) {
                    // Если в ответе есть ошибка, выбрасываем исключение
                    throw new Error(result.error);
                  } else {
                    // Если ошибки нет, значит запрос успешен
                    toast.success("Статус изменен на предоставлено");
                    setSelectedRequest(null);
                    setAmount(null);
                    (async () => {
                      const endpointToCall = "/api/admin/requests/";
                      await console.log(token);
                      const response = await fetchGetEndpoint(
                        endpointToCall,
                        token
                      );

                      // Проверяем, что ответ успешный и содержит данные
                      if ("data" in response && Array.isArray(response.data)) {
                        setRequests(response.data); // Устанавливаем данные в state, это массив объектов типа Requests
                        console.log(response.data);
                      } else {
                        // Обработка ошибки, если response не содержит data или data не является массивом
                        console.error("Error fetching candidates:", response);
                      }
                    })();
                    console.log(requests);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                  }
                } catch (error) {
                  console.log(error); // Устанавливаем ошибку в состояние
                  toast.error("Изменения не сохранены");
                }
              }}
              className="bg-[#960047] h-11 rounded-2xl w-[189px]"
            >
              Предоставить
            </Button>
            <Button
              onClick={async () => {
                try {
                  const result = await fetchPatchEndpoint(
                    `/api/admin/requests/${selectedRequest.id}`,
                    { amount: selectedRequest.amount, status: "waited" },
                    token
                  );
                  console.log(result); // Устанавливаем ответ в состояние
                  if ("error" in result) {
                    // Если в ответе есть ошибка, выбрасываем исключение
                    throw new Error(result.error);
                  } else {
                    // Если ошибки нет, значит запрос успешен
                    toast.success("Статус изменен на отклонено");
                    setSelectedRequest(null);
                    setAmount(null);
                    (async () => {
                      const endpointToCall = "/api/admin/requests/";
                      await console.log(token);
                      const response = await fetchGetEndpoint(
                        endpointToCall,
                        token
                      );

                      // Проверяем, что ответ успешный и содержит данные
                      if ("data" in response && Array.isArray(response.data)) {
                        setRequests(response.data); // Устанавливаем данные в state, это массив объектов типа Requests
                        console.log(response.data);
                      } else {
                        // Обработка ошибки, если response не содержит data или data не является массивом
                        console.error("Error fetching candidates:", response);
                      }
                    })();
                  }
                } catch (error) {
                  console.log(error); // Устанавливаем ошибку в состояние
                  toast.error("Изменения не сохранены");
                }
              }}
              className="border-[#960047] h-11 rounded-2xl w-[189px] border-solid border-[1px] bg-white text-black"
            >
              Отклонить
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-11 border-[#CACBCD] rounded-2xl w-[189px] border-solid border-[1px] bg-white text-black"
            >
              Другое количество
            </Button>
          </div>
          <Toaster />
          <div className="border-[#CACBCD] rounded-xl border-solid border-[1px] mt-6 p-5 flex flex-col gap-[31px] border-b-[#01BEC2] border-b-4">
            <div>
              <p className="text-[#798087]">
                На {details.office_info.location}
              </p>
              <p className="text-black text-xl font-bold">
                {details.office_info.name}
              </p>
            </div>
            <div className="flex gap-[116px]">
              <div className="flex flex-col gap-3">
                <p>Количество квот всего:</p>
                <p>Количество квот за месяц:</p>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-right">{details.office_info.quota}</p>
                <p className="text-right">{details.office_info.used_quota}</p>
              </div>
            </div>
            <div className="flex justify-between text-[#96004F]">
              <p>{details.office_info.created_at.split("T")[0]}</p>
              <p>Запрошено</p>
              <p>{selectedRequest.amount}</p>
            </div>
          </div>
          <div className=" w-[100%]">
            <div
              onClick={() => setHistory(!history)}
              className={`flex justify-between py-[10px] px-4 border-[#CACBCD] rounded-xl border-solid border-[1px] w-[100%] mt-5 cursor-pointer ${
                history && "bg-[#F6F6F7]"
              }`}
            >
              <p>История запросов квот</p>
              <ArrowDown />
            </div>
            {history && (
              <div className="border-[#CACBCD] rounded-xl border-solid border-r-[1px] border-b-[1px] border-t-[1px]">
                {details.history.map((detailElement, index) => (
                  <div
                    className={`text-lg py-[10px] px-4 border-[#F6F6F7] rounded-xl border-solid border-[1px] flex justify-between border-l-[4px] ${
                      detailElement.status == "Предоставлено"
                        ? "border-l-[#00AAAD]"
                        : "border-l-[#FF5E01]"
                    }`}
                    key={index}
                  >
                    <p>{status[status.indexOf(detailElement.status) + 1]}</p>
                    <p className="text-[#686E74]">
                      {detailElement.created_at.split("T")[0]}
                    </p>
                    <p>{detailElement.amount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {isModalOpen && (
        <div
          className="modal-backdrop fade show"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Полупрозрачный фон
            zIndex: 1040, // Поддержка z-index для фона
          }}
          onClick={handleBackdropClick}
        ></div>
      )}

      {/* Модальное окно */}
      {isModalOpen && (
        <div
          className="modal fade show"
          style={{
            padding: "10px 60px 10px 10px",
            display: "block",
            zIndex: 1050,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Центрирование модального окна
            width: "426px",
            height: "164px",
            backgroundColor: "white", // Белый фон
            borderRadius: "10px", // Округление углов
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Легкая тень для красоты
          }}
          tabIndex={-1}
          role="dialog"
        >
          <p>Введите количество</p>
          <Input
            value={amount || 0}
            className={`rounded-xl 
                  }`} // Красная рамка при ошибке
            placeholder="Email"
            onInput={(e) => setAmount(Number(e.currentTarget.value))}
          />
        </div>
      )}
    </div>
  );
};
