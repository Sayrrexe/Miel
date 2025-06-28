/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import fetchGetEndpoint, {fetchDelete} from "@/lib/candidates";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import {useRouter} from "next/navigation";
import {Trash} from "@/components/ui/icons/trash";
import {Edit} from "@/components/ui/icons/edit";
import css from "./main.module.css";

export const AdminItems = () => {
  interface User {
    first_name: string;
    last_name: string;
    username: string;
    patronymic: string | null;
    phone: string | null;
    email: string;
    full_name: string;
  }

  interface Candidate {
    department: string | null;
    id: number;
    office: number;
    user: User;
    photo: string;
    office_name: string;
  }

  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const token = localStorage.getItem("token") || "";
  const router = useRouter();

  const openModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate); // Устанавливаем выбранного кандидата
    setIsModalOpen(true); // Открываем модальное окно
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null); // Очищаем выбранного кандидата
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains("modal-backdrop")) {
      closeModal();
    }
  };

  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/supervisors/";
      const response = await fetchGetEndpoint(endpointToCall, token);

      if ("data" in response && Array.isArray(response.data)) {
        setCandidates(response.data);
        console.log(response.data);
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        // Находим кнопку по её id или классу
        const button = document.getElementById("search") as HTMLButtonElement;
        if (button) {
          button.click(); // Активируем кнопку
        }
      }
    };

    // Добавляем слушатель события нажатия клавиши
    window.addEventListener("keydown", handleKeyPress);

    // Очистка слушателя при размонтировании компонента
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);
  return (
    <div className={cn(css.adminItemsContainer)}>

      <div className="pt-8 flex flex-col md:flex-row gap-4 md:gap-4 mb-1">
        <Input
          className="rounded-xl w-full md:w-[630px]"
          placeholder="Найти руководителя"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          variant="secondary"
          type="submit"
          onClick={async () => {
            const endpointToCall = "/api/admin/supervisors/";
            const response = await fetchGetEndpoint(
              endpointToCall,
              token,
              undefined,
              undefined,
              undefined,
              inputValue
            );

            if ("data" in response && Array.isArray(response.data)) {
              setCandidates(response.data);
            } else {
              console.error("Error fetching candidates:", response);
            }
          }}
          id="search"
          className={`w-full md:w-[160px]  ${css.officeItemsSearchButton}`}
        >
          {window.innerWidth < 1000 ? "⌕" : "Поиск"}
        </Button>
        <Button
          variant="default"
          className={`md:w-[226px] ${css.officeItemsAddButton}`}  // внимательно!
          onClick={() => router.push("addingAdmin")}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить руководителя"}
        </Button>
      </div>

      <div className="h-[calc(100vh-250px)] overflow-y-auto pr-3">
        <Table className="border-solid border-[#CACBCD] border-2 w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-center w-[326px]">
                ФИО
              </TableHead>
              <TableHead className="font-bold">Город</TableHead>
              <TableHead className="font-bold">Телефон</TableHead>
              <TableHead className="font-bold ">Email</TableHead>
              <TableHead className="font-bold">Офис</TableHead>
              <TableHead className="font-bold"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((objectData) => (
              <TableRow key={objectData.id}>
                <TableCell className="flex items-center gap-3">
                  <span className="w-6">{""}</span>
                  {objectData.photo ? (
                    <img
                      src={objectData.photo}
                      width={39}
                      height={39}
                      className="rounded-3xl pl-[40vw]"
                      alt="avatar"
                    />
                  ) : (
                    <Image
                      className="max-w-[90px] max-h-[90px]"
                      src={user}
                      width={39}
                      height={39}
                      alt="photo"
                    />
                  )}

                  <p>{`${objectData.user.last_name + " " + objectData.user.first_name + " " + objectData.user.patronymic || ""}`}</p>
                </TableCell>
                <TableCell>Москва</TableCell>
                <TableCell>{objectData.user.phone || "Не указан"}</TableCell>
                <TableCell>{objectData.user.email || "Не указан"}</TableCell>
                <TableCell>{objectData.office_name || "Не указан"}</TableCell>
                <TableCell>
                  <Edit
                    className={"text-tertiary-text cursor-pointer hover:text-menu-hvr"}
                    onClick={() => router.push(`/editAdmin/${objectData.id}`)}
                  />
                </TableCell>
                <TableCell onClick={() => openModal(objectData)}>
                  <Trash
                    className={"text-tertiary-text cursor-pointer hover:text-error-text"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Затемняющий фон */}
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
      {isModalOpen && selectedCandidate && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            zIndex: 1050,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Центрирование модального окна
            width: "426px",
            height: "164px",
            backgroundColor: "white", // Белый фон
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Легкая тень для красоты
          }}
          tabIndex={-1}
          role="dialog"
        >
          <div
            className="modal-content"
            style={{height: "100%"}}
          >
            <div
              className="modal-header"
              style={{
                padding: "10px 15px",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <button
                type="button"
                className="close"
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#000",
                }}
              >
                &times;
              </button>
            </div>
            <div
              className="modal-body"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                fontSize: "16px",
                gap: "24px",
              }}
            >
              <p>
                Вы уверены, что хотите удалить
                <br /> {selectedCandidate.user.last_name}{" "}
                {selectedCandidate.user.first_name}{" "}
                {selectedCandidate.user.patronymic}?
              </p>
              <div className="gap-4 flex">
                <Button
                  variant='secondary'
                  onClick={closeModal}
                  className="w-40 h-11 rounded-xl"
                >
                  Оставить
                </Button>
                <Button
                  onClick={async () => {
                    console.log(selectedCandidate);
                    const endpoint = `/api/admin/supervisors/${selectedCandidate.id}`; // Используем индекс кандидата для удаления

                    const result = await fetchDelete(endpoint, token);

                    if (result && "error" in result) {
                      console.log(result.error);
                      closeModal();
                    } else {
                      console.log(result);
                      closeModal();
                      {
                        (async () => {
                          const endpointToCall = "/api/admin/supervisors/";
                          const response = await fetchGetEndpoint(
                            endpointToCall,
                            token
                          );

                          if (
                            "data" in response &&
                            Array.isArray(response.data)
                          ) {
                            setCandidates(response.data);
                            console.log(response.data);
                          } else {
                            console.error(
                              "Error fetching candidates:",
                              response
                            );
                          }
                        })();
                      }
                    }
                  }}
                  className="w-40 h-11 rounded-xl text-white bg-[#960047]"
                >
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
