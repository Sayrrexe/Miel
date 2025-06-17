"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { OfficeItems } from "./officeItems";
import { AdminItems } from "./adminItems";

export const FilterCategories = () => {
  const [page, setPage] = useState(true);

  return (
    <div
      className={cn("max-w-[78vw] pt-8 pl-[23px] flex flex-col justify-between")}
    >
      <div className="flex gap-[32px]">
        <p
          onClick={() => setPage(true)}
          className={`font-medium text-3xl hover:border-b-2 hover:border-solid hover:border-orange-500 ${
            page
              ? "border-b-2 border-solid border-orange-500"
              : "opacity-50 cursor-pointer"
          }`}
        >
          Офисы
        </p>
        <p
          onClick={() => setPage(false)}
          className={`font-medium text-3xl hover:border-b-2 hover:border-solid hover:border-orange-500 cursor-pointer ${
            !page
              ? "border-b-2 border-solid border-orange-500"
              : "opacity-50 cursor-pointer"
          }`}
        >
          Руководители
        </p>
      </div>
      {page ? <OfficeItems /> : <AdminItems />}
    </div>
  );
};
