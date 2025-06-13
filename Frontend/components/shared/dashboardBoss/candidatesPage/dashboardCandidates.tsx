"use client";
import {cn} from "@/lib/utils";
import {BossFilters} from ".";
import {candidatObject} from "../../consts/data";
import {Candidate} from "../../candidate";
import {fetchGetCandidates} from "@/lib/candidates";
import {useEffect, useState} from "react";

export const DashboardBossCandidates = () => {
  const [age_max, setAge_max] = useState<number>(0);
  const [age_min, setAge_min] = useState<number>(0);
  const [by_new, setBy_new] = useState<boolean>(false); // Типизируем как boolean
  const [courses, setCourses] = useState<string[]>([]);
  const [candidates, setCandidates] = useState<candidatObject[]>([]);
  const token = localStorage.getItem("token") || "";
  useEffect(() => {
    console.log(token);
    (async () => {
      const response = await fetchGetCandidates(
        "/api/supervisor/candidates/",
        token,
        age_max,
        age_min,
        by_new,
        courses
      );

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setCandidates(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [age_max, age_min, by_new, courses, token]);
  return (
    <div
      onClick={() => console.log(candidates)}
      className={cn("w-[81vw] pt-8 pl-[23px] flex flex-col justify-between")}
    >
      <BossFilters
        age_max={age_max}
        age_min={age_min}
        courses={courses}
        setAge_max={setAge_max}
        setAge_min={setAge_min}
        setBy_new={setBy_new || true}
        setCourses={setCourses}
      />
      <p className="mt-4 font-semibold text-xl">
        По вашему запросу найдено {candidates ? candidates.length : ""}{" "}
        кандидатов
      </p>
      <div className="flex  flex-wrap ml-[-10px] gap-0 w-[84vw] mt-[10px] pl-[10px] overflow-y-scroll h-[720px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        {candidates.length &&
          candidates.map((candidatObject) => (
            <Candidate
              candidate={candidatObject}
              key={candidatObject.id}
            />
          ))}
      </div>
    </div>
  );
};
