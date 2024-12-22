"use client";
import { Button, Input } from "@/components/ui";
import fetchGetEndpoint from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { CandidatesTable } from "./candidatesTable";
import { useRouter } from "next/navigation";
import { useCTokenStore } from "@/store/context";

export const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const token = useCTokenStore((state) => state.token);
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/candidates/";
      setCandidates(await fetchGetEndpoint(endpointToCall, token));
    })();
  }, []);
  const router = useRouter();
  return (
    <div className={cn("")}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input
          className="rounded-none w-[696px] ml-10"
          placeholder="Найти кандидата"
          onClick={() => console.log(candidates)}
        />
        <Button
          onClick={() => console.log(candidates)}
          className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] rounded-none hover:bg-[#960047]"
        >
          Поиск
        </Button>
        <Button
          className="bg-[#960047] w-[226px] rounded-none hover:bg-[#960046a9] text-lg"
          onClick={async () => {
            router.push("/addingCandidate");
          }}
        >
          Добавить кандидата
        </Button>
      </div>
      <CandidatesTable />
    </div>
  );
};
