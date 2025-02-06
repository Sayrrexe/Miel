"use client";
import {
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PersonalInfoProps {
  age_max: number;
  age_min: number;
  courses: string[];
  setAge_max: React.Dispatch<React.SetStateAction<number>>;
  setAge_min: React.Dispatch<React.SetStateAction<number>>;
  setBy_new: React.Dispatch<React.SetStateAction<boolean>>;
  setCourses: React.Dispatch<React.SetStateAction<string[]>>;
}

export const BossFilters = ({
  age_max,
  age_min,
  courses,
  setAge_max,
  setAge_min,
  setBy_new,
  setCourses,
}: PersonalInfoProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Функция для обработки выбора чекбокса в курсах
  const handleCheckboxChange = (course: string, checked: boolean) => {
    if (checked) {
      setCourses((prevCourses) => [...prevCourses, course]);
    } else {
      setCourses((prevCourses) =>
        prevCourses.filter((item) => item !== course)
      );
    }
  };

  // Функция для обработки клика по DropdownTrigger
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setAge_max(value);
    } else {
      setAge_max(0); // Очистка если нет значения
    }
  };

  const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setAge_min(value);
    } else {
      setAge_min(0); // Очистка если нет значения
    }
  };

  return (
    <div className="pt-8 pl-[-23px] flex gap-6 flex-wrap">
      {/* Фильтр для "По возрастанию/По убыванию" */}
      <Select
        onValueChange={(value: string) => {
          if (value === "По возрастанию") {
            setBy_new(false);
          } else {
            setBy_new(true);
          }
        }}
      >
        <SelectTrigger className="border-black border-opacity-40 border-[1px] h-[34px] w-[196px] rounded-md">
          <SelectValue placeholder={`Новые`} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={`По возрастанию`}>По возрастанию</SelectItem>
          <SelectItem value={`По убыванию`}>По убыванию</SelectItem>
        </SelectContent>
      </Select>

      {/* Фильтр для Максимального возраста с label */}
      <div className="flex flex-col w-[220px]">
        <Input
          value={age_max === 0 ? "" : age_max}
          placeholder="Макс. возраст"
          onChange={handleAgeMaxChange}
          className="border-black border-opacity-40 border-[1px] h-[34px] rounded-md placeholder:text-sm placeholder:text-gray-500"
        />
      </div>

      {/* Фильтр для Минимального возраста с label */}
      <div className="flex flex-col w-[220px]">
        <Input
          value={age_min === 0 ? "" : age_min}
          placeholder="Мин. возраст"
          onChange={handleAgeMinChange}
          className="border-black border-opacity-40 border-[1px] h-[34px] rounded-md placeholder:text-sm placeholder:text-gray-500"
        />
      </div>

      {/* Фильтр для курсов с предотвращением закрытия Dropdown */}
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger
          className="border-black border-opacity-40 w-[220px] border-[1px] h-[34px] flex justify-between items-center rounded-md p-3"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(); // Открытие/закрытие меню
          }}
        >
          <span className="text-xs opacity-70">Пройденные курсы</span>
          <ChevronDown className="w-4 h-5 opacity-40" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(); // Открытие/закрытие меню
          }}
          className="w-[220px] p-2"
        >
          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={courses.includes("course_rieltor_join")}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange("course_rieltor_join", checked)
              }
            />
            <span className="ml-2">Курс риэлторов</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={courses.includes("basic_legal_course")}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange("basic_legal_course", checked)
              }
            />
            <span className="ml-2">Базовый юридический курс</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={courses.includes("course_mortgage")}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange("course_mortgage", checked)
              }
            />
            <span className="ml-2">Курс ипотечного кредитования</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={courses.includes("course_taxation")}
              onCheckedChange={(checked: boolean) =>
                handleCheckboxChange("course_taxation", checked)
              }
            />
            <span className="ml-2">Курс по налогообложению</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
