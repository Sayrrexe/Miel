"use client";
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";
interface Props {
  className?: string;
}
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";

export const HistoryTable: React.FC<Props> = ({ className }) => {
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
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/supervisor/invitations/";
      setUsers((await fetchGetEndpoint(endpointToCall)).data);
    })();
  }, []);
  return (
    <div
      className={cn("flex flex-col justify-between", className)}
      onClick={() => console.log(users)}
    >
      <div className="flex gap-[92px] mt-10 text-xl">
        <p className="whitespace-nowrap text-xl">
          Данные с 01.02.20024 - 30.10. 2024
        </p>
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
      <Table className="border-solid border-[#CACBCD] border-2">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">ФИО</TableHead>
            <TableHead className="font-bold">Город</TableHead>
            <TableHead className="font-bold">Возраст</TableHead>
            <TableHead className="font-bold ">Статус</TableHead>
            <TableHead className="font-bold">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((objectData) => (
            <TableRow key={objectData.index}>
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

                <p>{objectData.name}</p>
              </TableCell>
              <TableCell>{objectData.city}</TableCell>
              <TableCell>{objectData.age} года</TableCell>
              <TableCell className="flex items-center gap-3">
                <div
                  className={`h-[39px] w-1 bg-[${
                    statusColor[statusColor.indexOf(objectData.status) + 1]
                  }]`}
                />
                {statusPosition[statusPosition.indexOf(objectData.status) + 1]}
              </TableCell>
              <TableCell>
                {objectData.data ? objectData.data : "Не указана"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
