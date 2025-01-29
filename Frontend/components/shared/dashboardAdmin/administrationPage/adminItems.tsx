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
import fetchGetEndpoint, { fetchDelete } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";

export const AdminItems = () => {
  interface User {
    first_name: string;
    username: string;
    patronymic: string | null;
    phone: string | null;
    email: string;
  }

  interface Candidate {
    department: string | null;
    id: number;
    office: number;
    user: User;
    photo: string;
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
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);

  return (
    <div className={cn("")}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input
          className="rounded-xl w-[696px]"
          placeholder="Найти руководителя"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
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
          className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] rounded-xl hover:bg-[#960047]"
        >
          Поиск
        </Button>
        <Button
          onClick={() => router.push("addingAdmin")}
          className="bg-[#960047] w-[226px] rounded-xl hover:bg-[#960046a9]"
        >
          Добавить руководителя
        </Button>
      </div>
      <Table className="border-solid border-[#CACBCD] border-2">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">ФИО</TableHead>
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
              <TableCell className="flex items-center gap-3 justify-center">
                {objectData.photo ? (
                  <img
                    src={objectData.photo}
                    width={39}
                    height={39}
                    className="rounded-3xl"
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

                <p>{`${objectData.user.first_name} ${objectData.user.username} ${objectData.user.patronymic}`}</p>
              </TableCell>
              <TableCell>Москва</TableCell>
              <TableCell>{objectData.user.phone}</TableCell>
              <TableCell>{objectData.user.email}</TableCell>
              <TableCell>{objectData.office}</TableCell>
              <TableCell onClick={() => openModal(objectData)}>
                <Trash
                  className="opacity-50 cursor-pointer"
                  width={16}
                  height={16}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
            borderRadius: "10px", // Округление углов
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Легкая тень для красоты
          }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-content" style={{ height: "100%" }}>
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
                <br /> {selectedCandidate.user.first_name}{" "}
                {selectedCandidate.user.username}?
              </p>
              <div className="gap-4 flex">
                <Button
                  variant={"outline"}
                  onClick={closeModal}
                  className="w-40 h-11 rounded-xl border-solid border-[1px] border-[#960047]"
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
                    } else {
                      console.log(result);
                      router.push("/candidates");
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
