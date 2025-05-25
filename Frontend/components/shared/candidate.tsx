/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import user from "@/public/assets/tcs61nk83dig738gik8qtkcx6ue7sgek.png";
import Image from "next/image";
import { fetchPostEndpoint } from "@/lib/candidates";
import toast, { Toaster } from "react-hot-toast";

interface Courses {
  id: number;
  name: string;
}
interface Achievements {
  achievement: number;
  achievement_name: string;
  count: number;
}

interface Props {
  candidate: {
    age: number;
    birth: string;
    candidate_achievements: Achievements[];
    city: string;
    country: string;
    courses: Courses[];
    education: string;
    favorite_id: number;
    id: number;
    is_favorite: boolean;
    is_invited: boolean;
    name: string;
    patronymic: string;
    photo: string;
    resume: string;
    surname: string;
  };
}

export const Candidate: React.FC<Props> = ({ candidate }) => {
  const token = localStorage.getItem("token") || "";
  return (
    <div className={cn("")}>
      <div className="w-[476px] shadow-xl mr-12 flex flex-col justify-between">
        {/* Контент */}
        <div className="pt-[35px] pl-[17px] pr-[17px] overflow-y-auto">
          <div className="flex gap-6">
            {candidate.photo != "-" && candidate.photo ? (
              <img
                className="max-w-[90px] max-h-[90px]"
                src={candidate.photo}
                width={90}
                height={90}
                alt="photo"
                onClick={() => console.log(candidate)}
              />
            ) : (
              <Image
                className="max-w-[90px] max-h-[90px]"
                src={user}
                width={90}
                height={90}
                alt="photo"
                onClick={() => console.log(candidate)}
              />
            )}

            <div className="flex flex-col">
              <p className="text-2xl">{candidate.name}</p>
              <div className="flex mt-5 justify-between">
                <div className="flex flex-col text-base">
                  <p>Дата рождения</p>
                  {candidate.city != null && <p>Город проживания</p>}
                  <p>Образование</p>
                  <p>Резюме</p>
                </div>
                <div className="flex flex-col text-base ml-[25px]">
                  <p>{candidate.birth ? candidate.birth : "Не указано"}</p>
                  <p>{candidate.city != null && candidate.city}</p>
                  <p>
                    {candidate.education ? candidate.education : "Не указано"}
                  </p>
                  <a
                    className="text-rose-500"
                    target="_blank"
                    href={`${candidate.resume}`}
                  >
                    Ссылка на резюме
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-9">
            {candidate.courses.length != 0 && (
              <p className="text-2xl">Обучение в Миэль</p>
            )}
            <div className="mt-2">
              {candidate.courses.map((course, index) => (
                <div key={index} className="flex gap-2 items-center text-xl">
                  <div className="bg-blue-400 w-3 h-3" />
                  <p>{course.name} (пройден)</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            {candidate.candidate_achievements.length != 0 && (
              <p className="text-2xl">Достижения</p>
            )}
            <div className="flex gap-[63px] mt-4 flex-wrap">
              {candidate.candidate_achievements.map((achieve) => (
                <div
                  key={achieve.achievement}
                  className="flex gap-2 items-center text-xl"
                >
                  <div className="bg-green-600 w-3 h-3" />
                  <p>
                    {achieve.achievement_name} {""}
                    {achieve.count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Прикреплённый низ */}
        <div className="pl-[94.5px] pr-[17px] pb-6 flex gap-4">
          <Button className="bg-[#960047] rounded-none hover:bg-[#960046a9]">
            Пригласить
          </Button>
          <Button
            onClick={async () => {
              console.log("Sending data:", { candidate: candidate.id });
              try {
                const response = await fetchPostEndpoint(
                  "/api/supervisor/favorites/",
                  { candidate: candidate.id },
                  token
                );
                console.log("Response:", response);
                if (response.error) {
                  throw new Error(response.error);
                } else {
                  toast.success("Кандидат отправлен в избранное!");
                }
              } catch (error) {
                console.error("Request failed:", error);
                toast.error("Произошла ошибка при добавлении в избранное");
              }
            }}
            className="bg-white text-black border-[#960047] border-solid border-[1px] rounded-none hover:bg-[#960047] hover:text-white"
          >
            В избранное
          </Button>
          <Toaster />
        </div>
      </div>
    </div>
  );
};
