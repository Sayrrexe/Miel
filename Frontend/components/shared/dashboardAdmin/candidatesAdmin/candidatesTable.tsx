"use client";
/* eslint-disable @next/next/no-img-element */
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import fetchGetEndpoint from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import { useCTokenStore } from "@/store/context";

export const CandidatesTable = () => {
  const [candidates, setCandidates] = useState([]);
  const token = useCTokenStore((state) => state.token);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/candidates/";
      setCandidates((await fetchGetEndpoint(endpointToCall, token)).data);
    })();
  }, []);
  return (
    <div className={cn("")}>
      <Table className="border-solid border-[#CACBCD] border-2 ml-10 w-[60vw]">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">ФИО</TableHead>
            <TableHead className="font-bold">Город</TableHead>
            <TableHead className="font-bold text-center">Телефон</TableHead>
            <TableHead className="font-bold">Свободен</TableHead>
            <TableHead className="font-bold text-center">Возраст</TableHead>
            <TableHead className="font-bold text-center">Офис</TableHead>
            <TableHead className="font-bold">Выбрать</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((objectData) => (
            <TableRow key={objectData.index}>
              <TableCell className="flex items-center gap-3 justify-center">
                {objectData.photo && objectData.photo != "-" ? (
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
              <TableCell className="text-center">{objectData.phone}</TableCell>
              <TableCell>
                <Checkbox className="ml-5" />
              </TableCell>
              <TableCell className="text-center">
                {objectData.birth} года
              </TableCell>
              <TableCell className="text-center">
                {objectData.office ? objectData.office : "нету"}
              </TableCell>
              <TableCell>
                <Checkbox className="ml-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
