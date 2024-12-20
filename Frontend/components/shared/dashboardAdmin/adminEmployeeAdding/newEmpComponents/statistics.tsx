import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";

export const Statistics = () => {
  return (
    <div
      className={cn(
        "flex pt-[25px] border-[1px]  border-solid border-[#CACBCD] border-t-0 pl-[9px] gap-6 pb-6"
      )}
    >
      <Table className="border-solid border-[#CACBCD] border-2">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold text-center">Офис</TableHead>
            <TableHead className="font-bold">Руководитель</TableHead>
            <TableHead className="font-bold">Статус</TableHead>
            <TableHead className="font-bold ">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="flex items-center gap-3 justify-center"></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
