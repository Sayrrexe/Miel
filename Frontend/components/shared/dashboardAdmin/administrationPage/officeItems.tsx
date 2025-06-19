"use client";
import {Button, Input} from "@/components/ui";
import {cn} from "@/lib/utils";
import {OfficeItem} from ".";
import {useEffect, useState} from "react";
import fetchGetEndpoint, {fetchPostEndpoint} from "@/lib/candidates";
import {useRouter} from "next/navigation";
import css from "./main.module.css";
import {useForm, Controller} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const schema = z.object({
  quotas: z.array(
    z.object({
      office_id: z.number(),
      amount: z.number().min(0, "Квота не может быть отрицательной"),
    })
  ),
});

type FormData = z.infer<typeof schema>;

export const OfficeItems = () => {
  interface User {
    first_name: string;
    last_name: string;
    email: string;
    full_name: string;
  }

  interface Supervisor {
    id: number;
    user: User;
    office: number;
    office_name: string;
    department: string;
  }

  interface Office {
    id: number;
    location: string;
    quota: number;
    used_quota: number;
    phone: string;
    name: string;
    mail: string;
    supervisor?: Supervisor;
  }

  const [offices, setOffices] = useState<Office[]>([]);
  const router = useRouter();
  const token = localStorage.getItem("token") || "";
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {control, handleSubmit, reset} = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      quotas: offices.map((office) => ({
        office_id: office.id,
        amount: office.quota,
      })),
    },
  });

  const fetchOfficesAndSupervisors = async () => {
    try {
      const officeResponse = await fetchGetEndpoint(
        "/api/admin/offices/",
        token,
        undefined,
        undefined,
        undefined,
        search
      );

      const supervisorResponse = await fetchGetEndpoint(
        "/api/admin/supervisors/",
        token,
        undefined,
        undefined,
        undefined,
        search
      );

      if (
        "data" in officeResponse &&
        Array.isArray(officeResponse.data) &&
        "data" in supervisorResponse &&
        Array.isArray(supervisorResponse.data)
      ) {
        const officesWithSupervisors = officeResponse.data.map((office: Office) => {
          const supervisor = supervisorResponse.data.find(
            (sup: Supervisor) => sup.office === office.id
          );
          return {
            ...office,
            supervisor: supervisor || null,
          };
        });
        setOffices(officesWithSupervisors);
        reset({
          quotas: officesWithSupervisors.map((office: Office) => ({
            office_id: office.id,
            amount: office.quota,
          })),
        });
      } else {
        console.error("Error fetching data:", {
          officeResponse,
          supervisorResponse,
        });
      }
    } catch (error) {
      console.error("Error fetching offices or supervisors:", error);
    }
  };

  useEffect(() => {
    fetchOfficesAndSupervisors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, search]);

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.classList.contains(css.modalBackdrop)) {
      setIsModalOpen(false);
      reset();
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetchPostEndpoint(
        "/api/admin/quotas/update/",
        {quotas: data.quotas},
        token
      );
      if (response.error) {
        throw new Error(response.error);
      }
      await fetchOfficesAndSupervisors();
      setIsModalOpen(false);
      reset();
      toast.success("Квоты успешно обновлены");
    } catch (error) {
      console.error("Request failed:", error);
      toast.error("Ошибка при обновлении квот");
    }
  };

  return (
    <div className={cn(css.officeItemsContainer)}>
      <div
        className={`pt-8 flex flex-col md:flex-row gap-4 md:gap-4 ${css.otherButtons}`}
      >
        <Input
          className={`rounded-xl w-full md:w-[696px] max-w-[50%] ${css.officeItemsSearchInput}`}
          placeholder="Найти офис"
          id="search"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          variant="secondary"
          onClick={fetchOfficesAndSupervisors}
          className={` w-full md:w-[160px]  ${css.officeItemsSearchButton}`}
        >
          {window.innerWidth < 1000 ? "⌕" : "Поиск"}
        </Button>
        <Button
          variant="secondary"
          className={`w-full md:w-[160px]  ${css.officeItemsSearchButton}`}
          onClick={async () => {
            router.push("/addingOffice");
          }}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить офис"}
        </Button>
        <Button
          variant="default"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Начислить квоты
        </Button>
      </div>

      <div className={cn(css.officeItemsList)}>
        {offices.map((officeData, index) => (
          <OfficeItem
            key={officeData.id}
            officeData={officeData}
            index={index}
          />
        ))}
      </div>

      {isModalOpen && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className={css.modalBackdrop}
            onClick={handleBackdropClick}
          >
            <div
              className={css.modal}
              role="dialog"
              aria-labelledby="modalTitle"
            >
              <div className={css.modalContent}>
                <div className={css.modalHeader}>
                  <button
                    type="button"
                    className={css.modalCloseButton}
                    onClick={() => {
                      setIsModalOpen(false);
                      reset();
                    }}
                    aria-label="Закрыть модальное окно"
                  >
                    ×
                  </button>
                </div>
                <div className={css.modalBody}>
                  <p
                    id="modalTitle"
                    className="text-3xl"
                  >
                    Квоты
                  </p>
                  <div className={css.modalQuotaList}>
                    {offices.map((office, index) => (
                      <div
                        className="grid grid-cols-[1fr_70px] items-center gap-x-4"
                        key={index}
                      >
                        <p className="truncate text-left">{office.name}</p>
                        <Controller
                          name={`quotas.${index}.amount`}
                          control={control}
                          defaultValue={office.quota}
                          render={({field, fieldState: {error}}) => (
                            <>
                              <Input
                                type="number"
                                className="min-h-11 rounded-xl w-[70px] text-center"
                                placeholder="0"
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                              {error && (
                                <p className="text-red-500 text-sm">{error.message}</p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className={`md:w-[160px] ${css.officeItemsSearchButton}`}
                      onClick={() => {
                        setIsModalOpen(false);
                        reset();
                      }}
                    >
                      Отменить
                    </Button>
                    <Button
                      variant="default"
                      className={`md:w-[160px] ${css.officeItemsAddButton}`}
                      type="submit"
                    >
                      Сохранить
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
