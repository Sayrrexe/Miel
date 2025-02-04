"use client";
import { cn } from "@/lib/utils";
import { Candidate } from "./candidate";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";
import { bossCandidatObject } from "./consts/data";

export const Favored = () => {
  const [candidates, setCandidates] = useState<bossCandidatObject[]>([]);
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/supervisor/favorites/";
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        console.log(response.data);
        setCandidates(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);
  return (
    <div className={cn("pt-8 pl-[23px]")}>
      <p className="text-4xl">Избранное</p>
      <div className="flex  flex-wrap ml-[-10px] gap-0 w-[84vw] justify-between mt-[10px] pl-[10px] overflow-y-scroll h-[720px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        {candidates.length == 0 ? (
          <p className="text-2xl">Вы пока еще никого не занесли в избранное</p>
        ) : (
          candidates.map((candidatObject) => (
            <Candidate
              candidate={candidatObject.candidate_info}
              key={candidatObject.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
