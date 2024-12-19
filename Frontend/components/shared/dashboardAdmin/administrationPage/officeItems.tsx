"use client";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { OfficeItem } from ".";
import { adminData } from "../../consts/data";
import { useEffect, useState } from "react";
import fetchGetEndpoint, { fetchPostEndpoint } from "@/lib/candidates";
import { useRouter } from "next/navigation";

interface Props {
  className?: string;
}

export const OfficeItems: React.FC<Props> = ({ className }) => {
  const [offices, setOffices] = useState([]);
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      setOffices((await fetchGetEndpoint(endpointToCall)).data);
    })();
  }, []);
  return (
    <div className={cn("", className)}>
      <div className="pt-8 pl-[-23px] flex gap-4">
        <Input className="rounded-none w-[696px]" placeholder="Найти офис" />
        <Button className="bg-white w-[160px] text-black border-[#960047] border-solid border-[1px] rounded-none hover:bg-[#960047]">
          Поиск
        </Button>
        <Button
          className="bg-[#960047] w-[160px] rounded-none hover:bg-[#960046a9]"
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
