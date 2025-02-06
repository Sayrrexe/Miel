"use client";
import { cn } from "@/lib/utils";
import { AvatarLoading } from "../../avatarLoading";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import {
  Office,
  PersonalInfo,
  Education,
  Statistics,
  AddInfo,
} from "./newEmpComponents";
import { useCandidates } from "@/store/context";
import fetchGetEndpoint, { fetchPatchEndpoint } from "@/lib/candidates";
import toast from "react-hot-toast";
import { data as DataType } from "../../consts/data";

type AddingEmployeeProps = {
  id: number;
};

export const AddingEmployee = ({ id }: AddingEmployeeProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [employee, setEmployee] = useState<DataType | null>(null);
  const [token, setToken] = useState("");
  const setCandidates = useCandidates((state) => state.setCandidates);
  const candidates = useCandidates((state) => state.data);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenFromStorage = localStorage.getItem("token") || "";
      setToken(tokenFromStorage);
    }
  }, []);

  // Update employee with the new photo value
  useEffect(() => {
    if (employee && photo !== null) {
      // Check if photo is defined
      setEmployee({ ...employee, photo });
      console.log(1);
    }
  }, [employee, photo]);

  useEffect(() => {
    if (!token) return;
    const fetchCandidates = async () => {
      const endpointToCall = "/api/admin/candidates/";
      const response = await fetchGetEndpoint(endpointToCall, token);
      if ("data" in response && Array.isArray(response.data)) {
        setCandidates(response.data);
      } else {
        console.error("Error fetching candidates:", response);
      }
    };
    fetchCandidates();
  }, [setCandidates, token]);

  useEffect(() => {
    if (!employee) return;
    const patchCandidate = async () => {
      try {
        const result = await fetchPatchEndpoint(
          `/api/admin/candidates/${employee.id}`,
          employee,
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
      setCandidates(
        candidates.map((candidate) =>
          candidate.id === employee.id
            ? { ...candidate, ...employee }
            : candidate
        )
      );
    };
    patchCandidate();
  }, [employee, candidates, token, setCandidates]);

  const [actCat, setActCat] = useState(0);

  const candidate = candidates.find((candidate) => candidate.id === id);

  if (!candidate) {
    return null;
  }

  const activePage = [
    <PersonalInfo data={candidate} key={0} />,
    <Office data={candidate} key={1} />,
    <Education key={2} data={candidate} />,
    <Statistics key={3} data={candidate} />,
    <AddInfo key={4} data={candidate} />,
  ];

  const categories: string[] = [
    "Персональная информация",
    "Офис",
    "Обучение",
    "Статистика",
    "Доп. Инфо",
  ];

  const userInfo = {
    name: candidate.name,
    surname: candidate.surname,
    patronymic: candidate.patronymic,
    birth: candidate.birth,
    country: candidate.country,
    city: candidate.city,
    phone: candidate.phone,
    email: candidate.email,
  };

  return (
    <div className={cn("mt-[52px] pl-10 w-full pr-10")}>
      <div className="w-full mr-10 border-[#CACBCD] border-solid border-[1px] pl-[23px] pb-[38px] pt-[18px] flex justify-between items-center">
        <div className="flex gap-[53px] items-center">
          <AvatarLoading photo={photo} setPhoto={setPhoto} />
          <div>
            <p>{userInfo.name}</p>
            <p className="py-[6px] px-2 bg-[#CACBCD] rounded-xl">Стажер</p>
          </div>
        </div>
        <div className="flex gap-4 items-center pr-9">
          <p className="flex gap-2 items-center border-[#960047] border-solid border-[2px] px-4 py-[10px] cursor-pointer hover:bg-[#96004675]">
            <Mail />
            Написать
          </p>
          <p className="border-[#960047] border-solid border-[2px] px-4 py-[10px] cursor-pointer hover:bg-[#96004675]">
            ...
          </p>
        </div>
      </div>
      <div className="flex mt-5 text-lg">
        {categories.map((categorie, index) => (
          <p
            onClick={() => setActCat(index)}
            className={`w-[20%] py-2 border-[1px]  border-solid border-[#CACBCD] text-center cursor-pointer ${
              index == actCat && "border-b-[0px]"
            }`}
            key={index}
          >
            {categorie}
          </p>
        ))}
      </div>
      {activePage[actCat]}
    </div>
  );
};
