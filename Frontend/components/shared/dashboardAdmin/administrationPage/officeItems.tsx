"use client";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { OfficeItem } from ".";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";
import { useRouter } from "next/navigation";

export const OfficeItems = () => {
  interface Office {
    location: string;
    quota: number;
    used_quota: number;
    phone: string;
    name: string;
    mail: string;
  }
  const [offices, setOffices] = useState<Office[]>([]);
  const router = useRouter();
  const token = localStorage.getItem("token") || "";
  const [search, setSearch] = useState<string>("");
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        undefined,
        undefined,
        undefined,
        search
      );

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setOffices(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  return (
    <div className={cn("")}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input
          className="rounded-lg w-[696px]"
          placeholder="Найти офис"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          onClick={() => {
            console.log(token);
            (async () => {
              const endpointToCall = "/api/admin/offices/";
              const response = await fetchGetEndpoint(
                endpointToCall,
                token,
                undefined,
                undefined,
                undefined,
                search
              );

              // Проверяем, что ответ успешный и содержит данные
              if ("data" in response && Array.isArray(response.data)) {
                setOffices(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
              } else {
                // Обработка ошибки, если response не содержит data или data не является массивом
                console.error("Error fetching candidates:", response);
              }
            })();
          }}
          className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] hover:bg-[#960047] rounded-xl"
        >
          Поиск
        </Button>
        <Button
          className="bg-[#960047] w-[160px] hover:bg-[#960046a9] rounded-xl"
          onClick={async () => {
            router.push("/addingOffice");
          }}
        >
          Добавить офис
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 mt-7 overflow-y-scroll w-[70vw] h-[720px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        {offices.map((candidatObject, index) => (
          <OfficeItem
            key={index}
            candidatObject={candidatObject}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};
