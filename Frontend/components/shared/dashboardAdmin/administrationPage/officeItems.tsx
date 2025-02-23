"use client";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { OfficeItem } from ".";
import { useEffect, useState } from "react";
import fetchGetEndpoint from "@/lib/candidates";
import { useRouter } from "next/navigation";
import css from "./main.module.css";

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

      if ("data" in response && Array.isArray(response.data)) {
        console.log(response.data);
        setOffices(response.data);
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        const button = document.getElementById("search") as HTMLButtonElement;
        if (button) {
          button.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <div className={cn(css.officeItemsContainer)}>
      <div
        className={`pt-8 flex flex-col md:flex-row gap-4 md:gap-6 ${css.otherButtons}`}
      >
        <Input
          className={`rounded-lg w-full md:w-[696px] ${css.officeItemsSearchInput}`}
          placeholder="Найти офис"
          id="search"
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

              if ("data" in response && Array.isArray(response.data)) {
                setOffices(response.data);
              } else {
                console.error("Error fetching candidates:", response);
              }
            })();
          }}
          className={`bg-white w-full md:w-[160px] text-black border-[#960047] border-solid border-[1px] hover:bg-[#960047] rounded-xl md:mr-4 ${css.officeItemsSearchButton}`}
        >
          {window.innerWidth < 1000 ? "⌕" : "Поиск"}
        </Button>
        <Button
          className={`bg-[#960047] w-full md:w-[160px] hover:bg-[#960046a9] rounded-xl md:mr-4 ${css.officeItemsAddButton}`}
          onClick={async () => {
            router.push("/addingOffice");
          }}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить офис"}
        </Button>
      </div>

      <div
        className={`flex flex-wrap gap-4 mt-7 overflow-y-scroll w-full md:w-[70vw] h-[720px] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-gray-100 ${css.officeItemsList}`}
      >
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
