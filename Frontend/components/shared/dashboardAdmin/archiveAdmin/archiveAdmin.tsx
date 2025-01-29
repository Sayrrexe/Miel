"use client";

import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useState } from "react";
import DatePicker from "react-date-picker";
import { ArchiveTable } from ".";

export const ArchiveAdmin = () => {
  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const [value, onChange] = useState<Value>(null);
  const [value2, onChange2] = useState<Value>(null);
  return (
    <div
      className={cn(
        "w-[81vw] pt-[54px] pl-[31px] flex flex-col justify-between"
      )}
    >
      <div>
        <p className="text-lg">Информация за период</p>
        <div className="flex gap-16 items-end">
          <div className="flex items-center gap-4 mt-6">
            <DatePicker
              className={"h-10 w-52 text-sm"}
              onChange={onChange}
              value={value}
            />
            <p className="text-2xl">-</p>
            <DatePicker
              className={"h-10 w-52 text-sm"}
              onChange={onChange2}
              value={value2}
            />
            <Button className="bg-[#960047] w-[94px] hover:bg-[#960046bb] rounded-xl h-[100%]">
              Искать
            </Button>
          </div>
        </div>
      </div>
      <ArchiveTable start_date={value} end_date={value2} />
    </div>
  );
};
