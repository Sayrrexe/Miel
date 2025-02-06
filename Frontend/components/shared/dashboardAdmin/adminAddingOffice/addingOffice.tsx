"use client";
import { Button, Input } from "@/components/ui";
import { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const AddingOffice = () => {
  const [officeData, setOfficeData] = useState({
    location: "",
    quota: 0,
    used_quota: 0,
    phone: "",
    name: "",
    mail: "",
  });
  const token = localStorage.getItem("token") || "";
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <Link href={"./main1"} className="flex gap-[10px] hover:text-gray-300">
        <ArrowLeft />
        Вернуться
      </Link>
      <div className="mt-[29px]">
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Локация офиса</p>
            <Input
              value={officeData.location}
              placeholder="Локация офиса"
              className="w-[450px] rounded-xl"
              onInput={(e) =>
                setOfficeData({
                  location: e.currentTarget.value,
                  quota: officeData.quota,
                  used_quota: officeData.used_quota,
                  phone: officeData.phone,
                  name: officeData.name,
                  mail: officeData.mail,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Название офиса</p>
            <Input
              onInput={(e) =>
                setOfficeData({
                  location: officeData.location,
                  quota: officeData.quota,
                  used_quota: officeData.used_quota,
                  phone: officeData.phone,
                  name: e.currentTarget.value,
                  mail: officeData.mail,
                })
              }
              value={officeData.name}
              placeholder="Название офиса"
              className="w-[450px] rounded-xl"
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Количество квот</p>
            <Input
              type="phone"
              value={officeData.quota}
              className="w-[450px] rounded-xl"
              placeholder="Количество квот"
              onInput={(e) =>
                setOfficeData({
                  location: officeData.location,
                  quota: Number(e.currentTarget.value),
                  used_quota: officeData.used_quota,
                  phone: officeData.phone,
                  name: officeData.name,
                  mail: officeData.mail,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Количество свободных квот</p>
            <Input
              value={officeData.used_quota}
              className="w-[450px] rounded-xl"
              placeholder="Количество свободных квот"
              onInput={(e) =>
                setOfficeData({
                  location: officeData.location,
                  quota: officeData.quota,
                  used_quota: Number(e.currentTarget.value),
                  phone: officeData.phone,
                  name: officeData.name,
                  mail: officeData.mail,
                })
              }
            />
          </div>
        </div>
        <Button
          className="mt-8 bg-[#960047] w-[160px] h-[44px] rounded-xl"
          onClick={async () => {
            console.log("Sending data:", officeData);
            try {
              const response = await fetchPostEndpoint(
                "/api/admin/offices/",
                officeData,
                token
              );
              console.log("Response:", response);
              if (response.error) {
                // Если в ответе есть ошибка, выбрасываем исключение
                throw new Error(response.error);
              } else {
                // Если ошибки нет, значит запрос успешен
                toast.success("Офис добавлен!");
              }
            } catch (error) {
              console.error("Request failed:", error);
              toast.error("Офис не добавлен");
            }
          }}
        >
          Добавить
        </Button>
      </div>
      <Toaster />
    </div>
  );
};
