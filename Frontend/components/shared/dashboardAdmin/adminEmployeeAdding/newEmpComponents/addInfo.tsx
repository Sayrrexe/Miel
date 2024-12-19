import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export const AddInfo: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6",
        className
      )}
    >
      <div className="text-lg flex flex-col gap-3 ml-[29px] items-start">
        <p className="flex gap-2 items-center w-[148px] h-[44px] text-center">
          Объекты
        </p>
        <p className="flex gap-2 items-center h-[44px] text-center">Клиенты</p>
      </div>
      <div className="flex gap-3 flex-col w-full">
        <Input
          className="min-h-11 w-[38vw] rounded-none"
          placeholder="Объекты"
        />
        <Input
          className="min-h-11 w-[38vw] rounded-none"
          placeholder="Клиенты"
        />
      </div>
      <Button className="bg-[#960047] text-lg rounded-none w-[212px] h-[44px] mt-[15%] mr-[44px]">
        Сохранить изменения
      </Button>
    </div>
  );
};
