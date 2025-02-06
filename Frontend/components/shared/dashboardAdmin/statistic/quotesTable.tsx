"use client";
import {
  Checkbox,
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
import { Check } from "lucide-react";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

interface PersonalInfoProps {
  start_date: Value;
  end_date: Value;
}

export const QuotesTable = ({ start_date, end_date }: PersonalInfoProps) => {
  const token = localStorage.getItem("token") || "";
  interface Quotes {
    month: string;
    issued: number;
    subtracted: number;
    invited: number;
    accepted: number;
    rejected: number;
  }
  const [quotes, setQuotes] = useState<Quotes[]>([]);
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/statistic/quotas";
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        start_date,
        end_date
      );

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setQuotes(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [end_date, start_date, token]);
  return (
    <div className={cn("")}>
      <p onClick={() => console.log(quotes)} className="mt-10 text-xl"></p>
      <Table
        onClick={() => console.log(quotes)}
        className="border-solid border-[#CACBCD] border-2 w-[697px] text-sm "
      >
        <TableHeader>
          <TableRow className="h-16 ">
            <TableHead className="font-bold text-black w-[56px]">
              <Check />
            </TableHead>
            <TableHead className="font-bold text-black text-sm bg-[#EDEEEE]">
              Период
            </TableHead>
            <TableHead className="font-bold text-black text-center text-sm">
              Выдано
            </TableHead>
            <TableHead className="font-bold text-black text-center text-sm">
              Приглашений
            </TableHead>
            <TableHead className="font-bold text-black text-center text-sm">
              Трудоустроено
            </TableHead>
            <TableHead className="font-bold text-black text-center text-sm">
              Отказы
            </TableHead>
            <TableHead className="font-bold text-black text-center text-sm">
              Снято
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((objectData, index) => (
            <TableRow key={index}>
              <TableCell className="gap-3 w-[56px]">
                <Checkbox />
              </TableCell>
              <TableCell className="gap-3 text-sm w-[104px] h-[56px] bg-[#EDEEEE]">
                {objectData.month.slice(0, -5)}
              </TableCell>
              <TableCell className="text-sm pl-4 h-[56px]">
                {objectData.subtracted}
              </TableCell>
              <TableCell className="text-sm pl-5 h-[56px]">
                {objectData.invited}
              </TableCell>
              <TableCell className="text-sm pl-5 h-[56px]">
                {objectData.accepted}
              </TableCell>
              <TableCell className="text-sm pl-5 h-[56px]">
                {objectData.rejected}
              </TableCell>
              <TableCell className="text-sm pl-5 h-[56px]">
                {objectData.issued}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="h-[56px]">
            <TableCell className="gap-3 w-[56px]">
              <Checkbox />
            </TableCell>
            <TableCell className="gap-3 text-sm bg-[#CACBCD]">Итого</TableCell>
            <TableCell className="text-sm pl-4">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.subtracted;
              }, 0)}
            </TableCell>
            <TableCell className="text-sm pl-5">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.invited;
              }, 0)}
            </TableCell>
            <TableCell className="text-sm pl-5">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.accepted;
              }, 0)}
            </TableCell>
            <TableCell className="text-sm pl-5">
              {quotes.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.rejected;
              }, 0)}
            </TableCell>
            <TableCell className="text-sm pl-5">
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
