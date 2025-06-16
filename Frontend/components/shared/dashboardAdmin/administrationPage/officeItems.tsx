"use client";
import {Button, Input} from "@/components/ui";
import {cn} from "@/lib/utils";
import {OfficeItem} from ".";
import {useEffect, useState} from "react";
import fetchGetEndpoint, {fetchPostEndpoint} from "@/lib/candidates";
import {useRouter} from "next/navigation";
import css from "./main.module.css";

export const OfficeItems = () => {
  interface Office {
    id: number;
    location: string;
    quota: number;
    used_quota: number;
    phone: string;
    name: string;
    mail: string;
  }

  interface newQuotes {
    office_id: number;
    amount: number;
  }

  const [offices, setOffices] = useState<Office[]>([]);
  const router = useRouter();
  const token = localStorage.getItem("token") || "";
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuotes, setNewQuotes] = useState<newQuotes[]>([]);

  useEffect(() => {
    console.log(token);
    (async () => {
      const endpointToCall = "/api/admin/offices/";
      const response = await fetchGetEndpoint(
        endpointToCall,
        token,
        undefined,
        undefined,
        undefined,
        search
      );

      if ("data" in response && Array.isArray(response.data)) {
        console.log(response.data);
        setOffices(response.data);
      } else {
        console.error("Error fetching candidates:", response);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

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
    if (target && target.classList.contains("modal-backdrop")) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className={cn(css.officeItemsContainer)}>
      <div
        className={`pt-8 flex flex-col md:flex-row gap-4 md:gap-4 ${css.otherButtons}`}
      >
        <Input
          className={`rounded-xl w-full md:w-[696px] max-w-[507px] ${css.officeItemsSearchInput}`}
          placeholder="Найти офис"
          id="search"
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
        <Button
          variant='secondary'
          onClick={() => {
            console.log(token);
            (async () => {
              const endpointToCall = "/api/admin/offices/";
              const response = await fetchGetEndpoint(
                endpointToCall,
                token,
                undefined,
                undefined,
                undefined,
                search
              );

              if ("data" in response && Array.isArray(response.data)) {
                setOffices(response.data);
              } else {
                console.error("Error fetching candidates:", response);
              }
            })();
          }}
          className={`bg-white w-full md:w-[160px] max-w-[160px] text-black hover:text-btn-sec-fg-hover border-[#960047] border-solid border-[1px] ${css.officeItemsSearchButton}`}
        >
          {window.innerWidth < 1000 ? "⌕" : "Поиск"}
        </Button>
        <Button
          variant='secondary'
          className={`bg-white w-full md:w-[160px] max-w-[160px] text-black border-[#960047] border-solid border-[1px] ${css.officeItemsSearchButton}`}
          onClick={async () => {
            router.push("/addingOffice");
          }}
        >
          {window.innerWidth < 1000 ? "+" : "Добавить офис"}
        </Button>
        <Button
          variant='default'
          className={`max-w-[173px]`}
          onClick={async () => {
            setIsModalOpen(true);
          }}
        >
          Начислить квоты
        </Button>
      </div>

      <div
        className={cn(css.officeItemsList)}  // поле для размещения карточек офисов
      >
        {offices.map((candidatObject, index) => (
          <OfficeItem
            key={candidatObject.id}
            candidatObject={candidatObject}
            index={index}
          />
        ))}
      </div>

      {isModalOpen && (
        <div
          className="modal-backdrop fade show"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Полупрозрачный фон
            zIndex: 1040, // Поддержка z-index для фона
          }}
          onClick={handleBackdropClick}
        ></div>
      )}

      {isModalOpen && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            zIndex: 1050,
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Центрирование модального окна
            width: "426px",
            backgroundColor: "white", // Белый фон
            borderRadius: "10px", // Округление углов
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Легкая тень для красоты
          }}
          tabIndex={-1}
          role="dialog"
        >
          <div
            className="modal-content"
            style={{height: "100%"}}
          >
            <div
              className="modal-header"
              style={{
                padding: "10px 15px",
                position: "absolute",
                top: 0,
                right: 0,
              }}
            >
              <button
                type="button"
                className="close"
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#000",
                }}
              >
                &times;
              </button>
            </div>
            <div
              className="modal-body my-6 mx-[45px]"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100%",
                fontSize: "16px",
                gap: "24px",
              }}
            >
              <p className="text-3xl ">Квоты</p>
              <div>
                {offices.map((office, index) => (
                  <div
                    className="flex gap-5 items-center"
                    key={index}
                  >
                    <p className="min-w-[100px] max-w-[100px] text-left overflow-hidden">
                      {office.name}
                    </p>
                    <Input
                      className="min-h-11 rounded-xl w-[70px]"
                      placeholder="0"
                      value={office.quota}
                      onInput={(e) => {
                        const amount = Number(e.currentTarget.value);

                        // Update the corresponding office in the offices list
                        const updatedOffices = offices.map((o) => {
                          if (o.id === office.id) {
                            return {...o, quota: amount}; // Update the quota value for the corresponding office
                          }
                          return o;
                        });
                        setOffices(updatedOffices); // Set the updated list of offices

                        // Handle newQuotes state
                        if (amount === 0) {
                          // Remove the office from the newQuotes array if it's already present
                          setNewQuotes((prevQuotes) =>
                            prevQuotes.filter(
                              (quote) => quote.office_id !== office.id
                            )
                          );
                        } else {
                          // Check if this office already exists in newQuotes
                          const existingQuoteIndex = newQuotes.findIndex(
                            (quote) => quote.office_id === office.id
                          );

                          if (existingQuoteIndex !== -1) {
                            // Update the amount of the existing quote
                            setNewQuotes((prevQuotes) => {
                              const updatedQuotes = [...prevQuotes];
                              updatedQuotes[existingQuoteIndex] = {
                                ...updatedQuotes[existingQuoteIndex],
                                amount,
                              };
                              return updatedQuotes;
                            });
                          } else {
                            // Add a new quote if it doesn't exist
                            setNewQuotes((prevQuotes) => [
                              ...prevQuotes,
                              {office_id: office.id, amount},
                            ]);
                          }
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4">
                <Button
                  className={`bg-white w-full md:w-[160px] text-black border-[#960047] border-solid border-[1px] hover:bg-[#960047] rounded-xl ${css.officeItemsSearchButton}`}
                  onClick={() => setIsModalOpen(false)}
                >
                  Отменить
                </Button>
                <Button
                  className={`bg-[#960047] w-full md:w-[160px] hover:bg-[#960046a9] rounded-xl ${css.officeItemsAddButton}`}
                  onClick={async () => {
                    console.log("Sending data:", newQuotes);
                    try {
                      const response = await fetchPostEndpoint(
                        "/api/admin/quotas/update/",
                        {quotas: newQuotes},
                        token
                      );
                      console.log("Response:", response);
                      if (response.error) {
                        // Если в ответе есть ошибка, выбрасываем исключение
                        throw new Error(response.error);
                      } else {
                        (async () => {
                          const endpointToCall = "/api/admin/offices/";
                          const response = await fetchGetEndpoint(
                            endpointToCall,
                            token,
                            undefined,
                            undefined,
                            undefined,
                            search
                          );

                          if (
                            "data" in response &&
                            Array.isArray(response.data)
                          ) {
                            console.log(response.data);
                            setOffices(response.data);
                          } else {
                            console.error(
                              "Error fetching candidates:",
                              response
                            );
                          }
                        })();
                      }
                    } catch (error) {
                      console.error("Request failed:", error);
                    }
                  }}
                >
                  Сохранить
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
