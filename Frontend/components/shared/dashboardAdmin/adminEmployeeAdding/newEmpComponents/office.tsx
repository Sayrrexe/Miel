import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
///import { useEmployee } from "@/store/context";
import { useEffect, useState } from "react";
import fetchGetEndpoint, { fetchPatchEndpoint } from "@/lib/candidates";
import { data } from "../../../consts/data";
import { useCandidates, useEmployee } from "@/store/context";
import toast, { Toaster } from "react-hot-toast";
interface PersonalInfoProps {
  data: data;
}
export const Office = ({ data }: PersonalInfoProps) => {
  interface Office {
    location: string;
    quota: number;
    used_quota: number;
    phone: string;
    name: string;
    mail: string;
  }
  const [offices, setOffices] = useState<Office[]>([]);
  const [token, setToken] = useState("");
  const setCandidates = useCandidates((state) => state.setCandidates);
  const candidates = useCandidates((state) => state.data);
  useEffect(() => {
    // Проверяем, что это клиентский рендер
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token") || "";
      setToken(tokenFromStorage);
    }
  }, []);

  const setEmployee = useEmployee((state) => state.setEmployee);
  const employee = useEmployee((state) => state.data);
  useEffect(() => setEmployee(data), [data, setEmployee]);
  ///const setEmployee = useEmployee((state) => state.setEmployee);
  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      const response = await fetchGetEndpoint(endpointToCall, token);

      // Проверяем, что ответ успешный и содержит данные
      if ("data" in response && Array.isArray(response.data)) {
        setOffices(response.data); // Устанавливаем данные в state, это массив объектов типа Candidate
      } else {
        // Обработка ошибки, если response не содержит data или data не является массивом
        console.error("Error fetching candidates:", response);
      }
    })();
  }, [token]);
  const handleChange = (value: string) => {
    if (value == "Свободен") {
      const updatedEmployee = { ...employee };
      delete updatedEmployee.office;
      setEmployee({ ...updatedEmployee, office_name: "", is_free: true });
    } else {
      const selectedOffice = offices.find((office) => office.name === value);

      // Проверяем, что selectedOffice не undefined, прежде чем использовать его
      if (selectedOffice) {
        console.log(selectedOffice);
        setEmployee({
          ...employee,
          is_free: false,
          office_name: value,
          office: offices.indexOf(selectedOffice) + 1, // Теперь гарантировано, что selectedOffice определен
        });
      } else {
        console.error("Офис не найден");
      }
    }
  };
  return (
    <div
      onClick={() => console.log(employee)}
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6 items-start"
      )}
    >
      <div className="text-lg flex flex-col gap-3 justify-center ml-[29px] items-start">
        <p className="h-11 flex items-center">Офис</p>
      </div>
      <div className="flex gap-3 flex-col w-full">
        <Select onValueChange={handleChange}>
          <SelectTrigger className="border-black border-solid border-opacity-40 border-[1px] h-[34px] min-h-11 w-[36vw] rounded-xl ">
            <SelectValue
              placeholder={`${!data.is_free ? data.office_name : "Свободен"}`}
            />
          </SelectTrigger>
          <SelectContent className="flex justify-between opacity-40">
            <SelectItem value={`Свободен`} className="ml-3">
              Свободен
            </SelectItem>
            {offices.map((office, index) => (
              <SelectItem value={`${office.name}`} className="ml-3" key={index}>
                {office.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        className="bg-[#960047] text-lg rounded-xl w-[212px] h-[44px] mr-8 mt-[15%]"
        onClick={async () => {
          try {
            const result = await fetchPatchEndpoint(
              `/api/admin/candidates/${data.id}`,
              employee,
              token
            );
            console.log(result); // Устанавливаем ответ в состояние
            if ("error" in result) {
              // Если в ответе есть ошибка, выбрасываем исключение
              throw new Error(result.error);
            } else {
              // Если ошибки нет, значит запрос успешен
              toast.success("Изменения сохранены!");
            }
          } catch (error) {
            console.log(error); // Устанавливаем ошибку в состояние
            toast.error("Изменения не сохранены");
          }
          setCandidates(
            candidates.map((candidate) =>
              candidate.id === data.id
                ? { ...candidate, ...employee }
                : candidate
            )
          );
        }}
      >
        Сохранить изменения
      </Button>
      <Toaster />
    </div>
  );
};
