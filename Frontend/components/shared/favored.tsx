"use client";
import { cn } from "@/lib/utils";
import { Candidate } from "./candidate";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";
import { useCTokenStore } from "@/store/context";

export const Favored = () => {
  const [candidates, setCandidates] = useState([]);
  const token = useCTokenStore((state) => state.token);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/supervisor/favorites/";
      setCandidates((await fetchGetEndpoint(endpointToCall, token)).data);
      console.log((await fetchGetEndpoint(endpointToCall, token)).data);
    })();
  }, []);
  return (
    <div className={cn("pt-8 pl-[23px]")}>
      <p className="text-4xl">Избранное</p>
      <div className="flex  flex-wrap ml-[-10px] gap-0 w-[84vw] justify-between mt-[10px] pl-[10px] overflow-y-scroll h-[720px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100">
        {candidates.length == 0 ? (
          <p className="text-2xl">Вы пока еще никого не занесли в избранное</p>
        ) : (
          candidates.map((candidatObject) => (
            <Candidate
              candidate={candidatObject.candidate}
              key={candidatObject.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
