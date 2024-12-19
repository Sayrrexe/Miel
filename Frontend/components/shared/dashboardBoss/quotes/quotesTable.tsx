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
import { quotesData } from "../../consts/data";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";

interface Props {
  className?: string;
}

export const QuotesTable: React.FC<Props> = ({ className }) => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/supervisor/info/quota/";
      setQuotes((await fetchGetEndpoint(endpointToCall)).data);
    })();
  }, []);
  return (
    <div className={cn("", className)}>
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
          {quotesData.map((objectData, index) => (
            <TableRow
              key={objectData.index}
              className={`${index % 2 == 1 && "bg-[#EDEEEE]"}`}
            >
              <TableCell className="gap-3 pl-12">{objectData.period}</TableCell>
              <TableCell className="text-center">{objectData.vidano}</TableCell>
              <TableCell className="text-center">
                {objectData.invitings}
              </TableCell>
              <TableCell className="text-center">
                {objectData.employment}
              </TableCell>
              <TableCell className="text-center">
                {objectData.rejections}
              </TableCell>
              <TableCell className="text-center">{objectData.snyato}</TableCell>
            </TableRow>
          ))}
          <TableRow className="bg-[#E6F9F9]">
            <TableCell className="gap-3 pl-12">Итого</TableCell>
            <TableCell className="text-center">
              {quotesData.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.vidano;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotesData.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.invitings;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotesData.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.employment;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotesData.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.rejections;
              }, 0)}
            </TableCell>
            <TableCell className="text-center">
              {quotesData.reduce(function (currentSum, currentNumber) {
                return currentSum + currentNumber.snyato;
              }, 0)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
