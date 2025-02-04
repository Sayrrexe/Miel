"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";

interface Quotes {
  month: string;
  issued: number;
  invited: number;
  accepted: number;
  rejected: number;
  subtracted: number;
}

export const QuotesTable = () => {
  const [quotes, setQuotes] = useState<Quotes[]>([]);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/supervisor/statistic/quotas";
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setQuotes(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);
  return (
    <div className={cn("")}>
      <p onClick={() => console.log(quotes)} className="mt-10 text-xl">
        Статистика за 2024
      </p>
      <Table className="border-solid border-[#CACBCD] border-2 ">
        <TableHeader>
          <TableRow className="h-16 bg-[#E6F9F9]">
            <TableHead className="font-bold pl-12 text-black">Период</TableHead>
            <TableHead className="font-bold text-black text-center">
              Выдано
            </TableHead>
            <TableHead className="font-bold text-black text-center">
              Приглашений
            </TableHead>
            <TableHead className="font-bold text-black text-center">
              Трудоустроено
            </TableHead>
            <TableHead className="font-bold text-black text-center">
              Отказы
            </TableHead>
            <TableHead className="font-bold text-black text-center">
              Снято
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((objectData, index) => (
            <TableRow
              key={index}
              className={`${index % 2 == 1 && "bg-[#EDEEEE]"}`}
            >
              <TableCell className="gap-3 pl-12">{objectData.month}</TableCell>
              <TableCell className="text-center">
                {objectData.subtracted}
              </TableCell>
              <TableCell className="text-center">
                {objectData.invited}
              </TableCell>
              <TableCell className="text-center">
                {objectData.accepted}
              </TableCell>
              <TableCell className="text-center">
                {objectData.rejected}
              </TableCell>
              <TableCell className="text-center">{objectData.issued}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-[#E6F9F9]">
            <TableCell className="gap-3 pl-12">Итого</TableCell>
            <TableCell className="text-center">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.subtracted;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.invited;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.accepted;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.rejected;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.issued;
              }, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
