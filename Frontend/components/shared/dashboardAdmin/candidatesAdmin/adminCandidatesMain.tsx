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
import {cn} from "@/lib/utils";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import {useCandidates} from "@/store/context";
import fetchGetEndpoint from "@/lib/candidates";
import {Magnifier} from "@/components/ui/icons/magnifier";
import css from "./main.module.css";

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
    <div className={`w-full max-w-[1000px] min-w-[950px] overflow-visible p-1 pl-10 min-h-0 h-auto`}>
      {/* инпут и кнопки */}
      <div className="pt-8 flex flex-row gap-4">
        <Input
          type="search"
          className={`w-full basis-4/5 `}
          placeholder="Найти кандидата"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          type="submit"
          variant="secondary"
          className={`w-full basis-1/5`}
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
        >
          {window.innerWidth < 1000 ? <Magnifier /> : "Поиск"}
        </Button>
        <Button
          type="submit"
          variant="default"
          className={`w-full basis-2/5`}
          onClick={async () => {
            router.push("/addingCandidate");
          }}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить кандидата"}
        </Button>
      </div>
      {/* таблица */}
      <div className={cn(css.tableContainer)}>
        <Table
          className={`border-solid border-border-primary border w-full`}
        >
          {/* Хэдер таблицы */}
          <TableHeader>
            <TableRow>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                ФИО
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Город
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Телефон
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Свободен
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Возраст
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Офис
              </TableHead>
              <TableHead className={`text-black text-base font-normal text-center tracking-tight`}>
                Выбрать
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((objectData, index) => (
              <TableRow
                className={css.rowT}
                key={index}
              >
                <Link href={`/addingEmployee/${objectData.id}`}>
                  <TableCell
                    className={`text-black flex justify-start items-center gap-3`}
                  >
                    <span className="w-6">{""}</span>
                    {objectData.photo && objectData.photo != "-" ? (
                      <img
                        src={objectData.photo}
                        width={39}
                        height={39}
                        className={`flex rounded-3xl max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px] ${css.candidatePhoto}`}
                        alt="avatar"
                      />
                    ) : (
                      <Image
                        className={`flex max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px] ${css.candidatePhoto}`}
                        src={user}
                        width={39}
                        height={39}
                        alt="photo"
                      />
                    )}

                    <p className={css.candidateName}>{objectData.name}</p>
                  </TableCell>
                </Link>
                <TableCell className={`text-black text-center tracking-tight`}>
                  {objectData.city}
                </TableCell>
                <TableCell className={`text-black text-center tracking-tight`}>
                  <span className="w-6">{""}</span>
                  {objectData.phone}
                </TableCell>
                <TableCell className={`text-black text-center tracking-tight`}>
                  <Checkbox
                    className="ml-5"
                    checked={false}
                  />
                </TableCell>
                <TableCell className={`text-black text-center tracking-tight`}>
                  {objectData.age} лет
                </TableCell>
                <TableCell className={`text-black text-center tracking-tight`}>
                  {objectData.office ? objectData.office : "нет"}
                </TableCell>
                <TableCell className={`text-black text-center tracking-tight`}>
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
