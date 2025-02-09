/* eslint-disable @next/next/no-img-element */
"use client";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PersonalInfoProps {
  start_date: Value;
  end_date: Value;
}

export const InvitationStatistic = ({
  start_date,
  end_date,
}: PersonalInfoProps) => {
  const token = localStorage.getItem("token") || "";
  interface Invitings {
    full_name: string;
    photo: string;
    age: number;
    city: string;
    status: string;
    updated_at: string;
  }
  const [invitings, setInvitings] = useState<Invitings[]>([]);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/statistic/invitations";
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        start_date,
        end_date
      );

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setInvitings(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [end_date, start_date, token]);

  const statusColor: string[] = [
    "invited",
    "#FF7B2F",
    "accepted",
    "#00AAAD",
    "rejected",
    "#991FA9",
  ];
  const statusPosition: string[] = [
    "invited",
    "Приглашен(а)",
    "accepted",
    "Трудоустроен(а)",
    "rejected",
    "Отказ",
  ];

  return (
    <div className={cn("flex flex-col justify-between mt-10")}>
      <div className="flex gap-[92px] text-xl mb-4">
        <div className="flex gap-11">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#FF7B2F]" />
            <p>Приглашен(а)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#00AAAD]" />
            <p>Трудоустроен(а)</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#991FA9]" />
            <p>Отказ</p>
          </div>
        </div>
      </div>

      {/* Контейнер с постоянным скроллом */}
      <div className="overflow-x-auto overflow-y-scroll max-h-[625px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        <Table className="min-w-full border-solid border-[#CACBCD] border-2">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">
                {/* Применен отступ слева для ФИО */}
                <p className="pl-12">ФИО</p>
              </TableHead>
              <TableHead className="font-bold">Город</TableHead>
              <TableHead className="font-bold">Возраст</TableHead>
              <TableHead className="font-bold">Статус</TableHead>
              <TableHead className="font-bold">Дата</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitings.map((objectData, index) => (
              <TableRow className="max-h-12" key={index}>
                <TableCell className="flex items-center gap-3 pl-[24px]">
                  {" "}
                  {/* Отступ слева для ячейки ФИО */}
                  <span className="w-5 h-12">{""}</span>
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
                  <p>{objectData.full_name}</p>
                </TableCell>
                <TableCell>{objectData.city}</TableCell>
                <TableCell>{objectData.age} года</TableCell>
                <TableCell className="flex items-center gap-3">
                  <div
                    className={`h-[39px] w-1 bg-[${
                      statusColor[statusColor.indexOf(objectData.status) + 1]
                    }]`}
                  />
                  {
                    statusPosition[
                      statusPosition.indexOf(objectData.status) + 1
                    ]
                  }
                </TableCell>
                <TableCell>
                  {objectData.updated_at
                    ? objectData.updated_at.split("T")[0]
                    : "Не указана"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
