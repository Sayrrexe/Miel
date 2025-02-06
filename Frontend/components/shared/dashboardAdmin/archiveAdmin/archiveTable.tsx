/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import { useEffect, useState } from "react";
import fetchGetEndpoint, { fetchPostEndpoint } from "@/lib/candidates";
import toast, { Toaster } from "react-hot-toast";

interface Users {
  id: number;
  bio: string;
  photo: string;
  city: string;
  phone: string;
  email: string;
  cause: string;
  full_name: string;
}

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PersonalInfoProps {
  start_date: Value;
  end_date: Value;
}

export const ArchiveTable = ({ start_date, end_date }: PersonalInfoProps) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [token, setToken] = useState("");
  useEffect(() => {
    console.log(start_date, end_date);
    // Проверяем, что это клиентский рендер
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token") || "";
      setToken(tokenFromStorage);
    }
  }, [end_date, start_date]);
  const [back, setBack] = useState<number[]>([]);
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/archive";
      await console.log(token);
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        start_date,
        end_date
      );

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setUsers(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
        console.log(response.data);
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
    console.log(users);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, start_date, end_date, back]);

  return (
    <div className={cn("w-[81vw] pt-[54px]")}>
      {users.length == 0 ? (
        <p onClick={() => console.log(users)}>Кандидаты не найдены</p>
      ) : (
        <div>
          <Table className="border-solid border-[#CACBCD] border-2 w-[1016px]">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-black w-[56px]">
                  <Check onClick={() => console.log()} />
                </TableHead>
                <TableHead className="font-bold text-black">Дата</TableHead>
                <TableHead className="font-bold text-black">
                  Кандидаты
                </TableHead>
                <TableHead className="font-bold text-black">Телефон</TableHead>
                <TableHead className="font-bold text-black">E-mail</TableHead>
                <TableHead className="font-bold text-black">
                  Офис / не прошел собес.
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((objectData) => (
                <TableRow key={objectData.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => setBack([...back, objectData.id])}
                    />
                  </TableCell>
                  <TableCell>
                    {objectData.bio ? objectData.bio : "Не указана"}
                  </TableCell>
                  <TableCell className="flex items-center gap-3">
                    {objectData.photo && objectData.photo != "-" ? (
                      <img
                        src={objectData.photo}
                        width={39}
                        height={39}
                        className="rounded-3xl max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px]"
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

                    <p>{objectData.full_name}</p>
                  </TableCell>
                  <TableCell>{objectData.phone}</TableCell>
                  <TableCell>{objectData.email}</TableCell>
                  <TableCell>{objectData.cause}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={async () => {
              console.log(back.join(", "));
              try {
                const result = await fetchPostEndpoint(
                  `/api/admin/archive/restore/`,
                  { candidate_ids: back.join(",") },
                  token
                );
                console.log(result); // Устанавливаем ответ в состояние
                if ("error" in result) {
                  // Если в ответе есть ошибка, выбрасываем исключение
                  throw new Error(result.error);
                } else {
                  // Если ошибки нет, значит запрос успешен
                  toast.success("Изменения сохранены!");
                }
              } catch (error) {
                console.log(error); // Устанавливаем ошибку в состояние
                toast.error("Изменения не сохранены");
              }
              setBack([]);
            }}
            className="mt-8 w-40 bg-[#960047] rounded-none"
          >
            Вернуть из архива
          </Button>
          <Toaster />
        </div>
      )}
    </div>
  );
};
