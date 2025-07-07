"use client";
import {Button} from "@/components/ui";
import {cn} from "@/lib/utils";
import {useState} from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import "../../dataPicker/Calendar.css";
import {InvitationStatistic} from "./invitationStatistic";
import {QuotesTable} from "./quotesTable";

export const Statistic = () => {
  type ValuePiece = Date | null;

  type Value = ValuePiece | [ValuePiece, ValuePiece];
  const [value, onChange] = useState<Value>(null);
  const [value1, onChange1] = useState<Value>(null);
  const [page, setPage] = useState(true);
  return (
    <div
      className={cn(
        "w-[78vw] pt-[54px] pl-[31px] flex flex-col justify-between"
      )}
    >
      <div>
        <p className="text-lg">Информация за период</p>
        <div className="flex gap-8 laptop:gap-16 items-end">
          <div className="flex items-center gap-4 mt-6">
            <DatePicker
              className={"h-10 w-52 text-sm"}
              onChange={onChange}
              value={value}
            />
            <p className="text-2xl">-</p>
            <DatePicker
              className={"h-10 w-52 text-sm"}
              onChange={onChange1}
              value={value1}
            />
            <Button
              variant="default"
              className="w-[94px] ">
              Искать
            </Button>
          </div>
          <div className="flex gap-2">
            <div
              className={`max-w-[108px] h-10 px-4 gap-2.5 flex content-end justify-center text-black text-3xl font-normal leading-10  ${
                page
                  ? "border-solid border-b-[3px] border-menu-hvr"
                  : "opacity-50 cursor-pointer"
              }`}
              onClick={() => setPage(true)}
            >
              Квоты
            </div>
            <div
              className={`max-w-[198px] h-10 px-4 gap-2.5 flex content-end justify-center text-black text-3xl font-normal leading-10 ${
                !page
                  ? "border-solid border-b-[3px] border-menu-hvr"
                  : "opacity-50 cursor-pointer"
              }`}
              onClick={() => setPage(false)}
            >
              Приглашения
            </div>
          </div>
        </div>
      </div>
      {page ? (
        <QuotesTable
          start_date={value}
          end_date={value1}
        />
      ) : (
        <InvitationStatistic
          start_date={value}
          end_date={value1}
        />
      )}
    </div>
  );
};
