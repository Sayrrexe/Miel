/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Button,
  Input,
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
import { useRouter } from "next/navigation";
import { useCTokenStore } from "@/store/context";
export const AdminItems = () => {
  const [candidates, setCandidates] = useState([]);
  const token = useCTokenStore((state) => state.token);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/supervisors/";
      setCandidates((await fetchGetEndpoint(endpointToCall, token)).data);
    })();
  }, []);
  const router = useRouter();
  return (
    <div className={cn("")} onClick={() => console.log(candidates)}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input
          className="rounded-none w-[696px]"
          placeholder="Найти руководителя"
        />
        <Button className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] rounded-none hover:bg-[#960047]">
          Поиск
        </Button>
        <Button
          onClick={async () => {
            router.push("/addingAdmin");
          }}
          className="bg-[#960047] w-[226px] rounded-none hover:bg-[#960046a9]"
        >
          Добавить руководителя
        </Button>
      </div>
      <Table className="border-solid border-[#CACBCD] border-2">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">ФИО</TableHead>
            <TableHead className="font-bold">Город</TableHead>
            <TableHead className="font-bold">Телефон</TableHead>
            <TableHead className="font-bold ">Email</TableHead>
            <TableHead className="font-bold">Офис</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((objectData) => (
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

                <p>{`${objectData.user.first_name} ${objectData.user.username} ${objectData.user.patronymic}`}</p>
              </TableCell>
              <TableCell>Москва</TableCell>
              <TableCell>{objectData.user.phone}</TableCell>
              <TableCell>{objectData.user.email}</TableCell>
              <TableCell>{objectData.office}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
