"use client";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { data } from "../../../consts/data";
import { useEffect, useState } from "react";
import fetchGetEndpoint, { fetchPatchEndpoint } from "@/lib/candidates";
import { useEmployee } from "@/store/context";
import toast, { Toaster } from "react-hot-toast";

interface PersonalInfoProps {
  data: data;
}

export const Statistics = ({ data }: PersonalInfoProps) => {
  interface Invitings {
    id: number;
    status: string;
    created_at: string;
    office_name: string;
    supervisor: string;
  }
  interface ToChange {
    id: number;
    toChangeId: string; // Мы используем строку здесь, но позже передадим это в объекте
  }
  const [toChange, setToChange] = useState<ToChange[]>([]);
  const [offices, setOffices] = useState<Invitings[]>([]);
  const token = localStorage.getItem("token") || "";
  const statusColor: string[] = [
    "invited",
    "#FF7B2F",
    "accepted",
    "#00AAAD",
    "rejected",
    "#991FA9",
  ];
  const statusPosition: string[] = [
    "invited",
    "Приглашен(а)",
    "accepted",
    "Трудоустроен(а)",
    "rejected",
    "Отказ",
  ];

  const setEmployee = useEmployee((state) => state.setEmployee);
  useEffect(() => setEmployee(data), [data, setEmployee]);

  useEffect(() => {
    console.log(token);
    (async () => {
      console.log(data.id);
      const endpointToCall = `/api/admin/candidates/${data.id}/invitations/`;
      const response = await fetchGetEndpoint(endpointToCall, token);

      if ("data" in response && Array.isArray(response.data)) {
        setOffices(response.data);
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();
    console.log(offices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id]);

  return (
    <div
      onClick={() => console.log(offices)}
      className={cn(
        "flex pt-[25px] border-[1px] border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6 flex-col"
      )}
    >
      <Table className="border-solid border-[#CACBCD] border-2 w-[95vw] max-w-[1200px] overflow-x-auto ">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">Офис</TableHead>
            <TableHead className="font-bold text-center">
              Руководитель
            </TableHead>
            <TableHead className="font-bold text-center">Статус</TableHead>
            <TableHead className="font-bold text-center">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offices.map((office, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                {office.office_name}
              </TableCell>
              <TableCell className="text-center">{office.supervisor}</TableCell>
              <TableCell className="text-center flex items-center gap-3 justify-center">
                <Select
                  onValueChange={(value: string) => {
                    const newStatus =
                      statusPosition[statusPosition.indexOf(value) - 1];
                    // Убедитесь, что значение не является неопределенным
                    if (newStatus) {
                      setToChange([
                        ...toChange,
                        {
                          id: office.id,
                          toChangeId: newStatus, // сохраняем статус
                        },
                      ]);
                    }
                  }}
                >
                  <SelectTrigger className="border-none  h-[34px] min-h-11 w-[190px] rounded-none shadow-none">
                    <SelectValue
                      placeholder={
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-[39px] w-1 bg-[${
                              statusColor[
                                statusColor.indexOf(office.status) + 1
                              ]
                            }]`}
                          />
                          <div>
                            {
                              statusPosition[
                                statusPosition.indexOf(office.status) + 1
                              ]
                            }
                          </div>
                        </div>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className="flex justify-between opacity-40"
                      key={index}
                      value={`${statusPosition[0]}`}
                    >
                      {
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-[39px] w-1 bg-[${statusColor[1]}]`}
                          />
                          <div>{statusPosition[1]}</div>
                        </div>
                      }
                    </SelectItem>
                    <SelectItem
                      className="flex justify-between opacity-40"
                      key={index}
                      value={`${statusPosition[1]}`}
                    >
                      {
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-[39px] w-1 bg-[${statusColor[3]}]`}
                          />
                          <div>{statusPosition[3]}</div>
                        </div>
                      }
                    </SelectItem>
                    <SelectItem
                      className="flex justify-between opacity-40"
                      key={index}
                      value={`${statusPosition[2]}`}
                    >
                      {
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-[39px] w-1 bg-[${statusColor[5]}]`}
                          />
                          <div>{statusPosition[5]}</div>
                        </div>
                      }
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-center">
                {office.created_at.split("T")[0]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Button
        className="bg-[#960047] text-lg rounded-xl w-[212px] h-[44px] relative left-[70vw]"
        onClick={async () => {
          console.log(toChange);
          toChange.map(async (object) => {
            try {
              const result = await fetchPatchEndpoint(
                `/api/admin/candidates/${data.id}/invitations/${object.id}`,
                { status: object.toChangeId }, // передаем объект с нужным полем
                token
              );
              console.log(result);
              if ("error" in result) {
                throw new Error(result.error);
              } else {
                toast.success("Изменения сохранены!");
              }
            } catch (error) {
              console.log(error);
              toast.error("Изменения не сохранены");
            }
          });
          setToChange([]);
        }}
      >
        Сохранить изменения
      </Button>
      <Toaster />
    </div>
  );
};
