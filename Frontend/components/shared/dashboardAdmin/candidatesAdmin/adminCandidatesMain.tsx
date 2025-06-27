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
    <div className={`w-full max-w-[1000px] min-w-[950px] overflow-visible p-1 min-h-0 h-auto`}>
      <div className="pt-8 flex flex-row gap-4">
        <Input
          className={`w-full basis-4/5 ml-10`}
          placeholder="Найти кандидата"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          variant="secondary"
          className={`w-full basis-2/5`}
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
          {window.innerWidth < 1000 ? <Magnifier/> : "Поиск"}
        </Button>
        <Button
          variant="default"
          className={`w-full basis-2/5`}
          onClick={async () => {
            router.push("/addingCandidate");
          }}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить кандидата"}
        </Button>
      </div>
      <div className={cn(css.tableContainer)}>
        <Table
          className={`border-solid border-[#CACBCD] border-2 ml-10 w-[60vw] ${css.table}`}
        >
          <TableHeader>
            <TableRow>
              <TableHead className={`font-bold text-center ${css.tableHead}`}>
                ФИО
              </TableHead>
              <TableHead className={`font-bold ${css.tableHead}`}>
                Город
              </TableHead>
              <TableHead className={`font-bold ${css.tableHead}`}>
                Телефон
              </TableHead>
              <TableHead className={`font-bold ${css.tableHead}`}>
                Свободен
              </TableHead>
              <TableHead className={`font-bold text-center ${css.tableHead}`}>
                Возраст
              </TableHead>
              <TableHead className={`font-bold text-center ${css.tableHead}`}>
                Офис
              </TableHead>
              <TableHead className={`font-bold ${css.tableHead}`}>
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
                    className={`flex items-center gap-3 ${css.tableCell}`}
                  >
                    <span className="w-6">{""}</span>
                    {objectData.photo && objectData.photo != "-" ? (
                      <img
                        src={objectData.photo}
                        width={39}
                        height={39}
                        className={`rounded-3xl max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px] ${css.candidatePhoto}`}
                        alt="avatar"
                      />
                    ) : (
                      <Image
                        className={`max-w-[90px] max-h-[90px] min-h-[39px] min-w-[39px] ${css.candidatePhoto}`}
                        src={user}
                        width={39}
                        height={39}
                        alt="photo"
                      />
                    )}

                    <p className={css.candidateName}>{objectData.name}</p>
                  </TableCell>
                </Link>
                <TableCell className={css.tableCell}>
                  {objectData.city}
                </TableCell>
                <TableCell className={css.tableCell}>
                  <span className="w-6">{""}</span>
                  {objectData.phone}
                </TableCell>
                <TableCell className={css.tableCellCheck}>
                  <Checkbox
                    className="ml-5"
                    checked={false}
                  />
                </TableCell>
                <TableCell className={`text-center ${css.tableCellAge}`}>
                  {objectData.age} лет
                </TableCell>
                <TableCell className={`text-center ${css.tableCellCheck}`}>
                  {objectData.office ? objectData.office : "нету"}
                </TableCell>
                <TableCell className={css.tableCellCheck}>
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
