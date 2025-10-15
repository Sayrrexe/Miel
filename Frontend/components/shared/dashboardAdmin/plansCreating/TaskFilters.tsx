"use client";
import { useState } from "react";
import DatePicker from "react-date-picker";
import "../../dataPicker/DatePicker.css";
import { Button } from "@/components/ui";
import { Value } from "@/types/api";

interface TaskFiltersProps {
  onFilter: (date?: Value) => void;
  error?: string | null;
}

export const TaskFilters = ({ onFilter, error }: TaskFiltersProps) => {
  const [value, onChange] = useState<Value>(null);

  return (
    <>
      <p>Выберите дату или период</p>
      <div>
        <DatePicker
          className={"mt-4 h-10 w-52 text-sm"}
          onChange={onChange}
          value={value}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <Button
          variant="default"
          onClick={() => {
            onFilter(value);
          }}
          className="ml-4 w-40 h-10 rounded-xl"
        >
          Выбрать
        </Button>
      </div>
    </>
  );
};