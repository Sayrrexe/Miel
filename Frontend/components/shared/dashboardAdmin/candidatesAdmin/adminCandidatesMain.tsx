/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import { useCandidates } from "@/store/context";
import fetchGetEndpoint from "@/lib/candidates";

export const AdminCandidates = () => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");
  const token = localStorage.getItem("token") || "";
  const setCandidates = useCandidates((state) => state.setCandidates);
  const candidates = useCandidates((state) => state.data);

  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/candidates/";
      const response = await fetchGetEndpoint(endpointToCall, token);
      console.log(response);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setCandidates(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [setCandidates, token]);
  return (
    <div className={cn("")}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input
          className="rounded-xl w-[696px] ml-10"
          placeholder="Найти кандидата"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            console.log(token);
            (async () => {
              const endpointToCall = "/api/admin/candidates/";
              const response = await fetchGetEndpoint(
                endpointToCall,
                token,
                undefined,
                undefined,
                undefined,
                search
              );
              console.log(response);

              // Проверяем, что ответ успешный и содержит данные
              if ("data" in response && Array.isArray(response.data)) {
                setCandidates(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
              } else {
                // Обработка ошибки, если response не содержит data или data не является массивом
                console.error("Error fetching candidates:", response);
              }
            })();
          }}
          className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] rounded-xl hover:bg-[#960047]"
        >
          Поиск
        </Button>
        <Button
          className="bg-[#960047] w-[226px] rounded-xl hover:bg-[#960046a9] text-lg"
          onClick={async () => {
            router.push("/addingCandidate");
          }}
        >
          Добавить кандидата
        </Button>
      </div>
      <div className={cn("")}>
        <Table className="border-solid border-[#CACBCD] border-2 ml-10 w-[60vw]">
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold text-center">ФИО</TableHead>
              <TableHead className="font-bold">Город</TableHead>
              <TableHead className="font-bold">Телефон</TableHead>
              <TableHead className="font-bold">Свободен</TableHead>
              <TableHead className="font-bold text-center">Возраст</TableHead>
              <TableHead className="font-bold text-center">Офис</TableHead>
              <TableHead className="font-bold">Выбрать</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((objectData, index) => (
              <TableRow key={index}>
                <Link href={`/addingEmployee/${objectData.id}`}>
                  <TableCell className="flex items-center gap-3">
                    <span className="w-6">{""}</span>
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
                        className="max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px]"
                        src={user}
                        width={39}
                        height={39}
                        alt="photo"
                      />
                    )}

                    <p>{objectData.name}</p>
                  </TableCell>
                </Link>
                <TableCell>{objectData.city}</TableCell>
                <TableCell>
                  <span className="w-6">{""}</span>
                  {objectData.phone}
                </TableCell>
                <TableCell>
                  <Checkbox className="ml-5" checked={objectData.is_free} />
                </TableCell>
                <TableCell className="text-center">
                  {objectData.age} лет
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
    </div>
  );
};
