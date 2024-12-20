"use client";
import { Button, Input } from "@/components/ui";
import { fetchPostEndpoint } from "@/lib/candidates";
import { cn } from "@/lib/utils";
import { useCTokenStore } from "@/store/context";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const AddingOffice = () => {
  const [officeData, setOfficeData] = useState({
    location: "",
    name: "",
    quota: 0,
    used_quota: 0,
  });
  const token = useCTokenStore((state) => state.token);
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <Link
        href={"./dashboardAdministration"}
        className="flex gap-[10px] hover:text-gray-300"
      >
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
              className="w-[450px]"
              onInput={(e) =>
                setOfficeData({
                  location: e.currentTarget.value,
                  name: officeData.name,
                  quota: officeData.quota,
                  used_quota: officeData.used_quota,
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
                  name: e.currentTarget.value,
                  quota: officeData.quota,
                  used_quota: officeData.used_quota,
                })
              }
              value={officeData.name}
              placeholder="Название офиса"
              className="w-[450px]"
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Количество квот</p>
            <Input
              type="phone"
              value={officeData.quota}
              className="w-[450px]"
              placeholder="Количество квот"
              onInput={(e) =>
                setOfficeData({
                  location: officeData.location,
                  name: officeData.name,
                  quota: Number(e.currentTarget.value),
                  used_quota: officeData.used_quota,
                })
              }
            />
          </div>
          <div className="flex gap-5 items-center">
            <p className="min-w-[134px] w-[210px]">Количество свободных квот</p>
            <Input
              value={officeData.used_quota}
              className="w-[450px]"
              placeholder="Количество свободных квот"
              onInput={(e) =>
                setOfficeData({
                  location: officeData.location,
                  name: officeData.name,
                  quota: Number(officeData.quota),
                  used_quota: Number(e.currentTarget.value),
                })
              }
            />
          </div>
        </div>
        <Button
          className="mt-8 bg-[#960047] w-[160px] h-[44px]"
          onClick={async () => {
            await fetchPostEndpoint("/api/admin/offices/", officeData, token);
          }}
        >
          Добавить
        </Button>
      </div>
    </div>
  );
};
