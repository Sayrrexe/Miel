"use client";
import { AddingEmployee } from "@/components/shared/dashboardAdmin/adminEmployeeAdding";
import { cn } from "@/lib/utils";
import { useCandidates } from "@/store/context";

type Props = {
  params: { id: string };
};

const DashboardCandidatesAdmin = ({ params }: Props) => {
  const { id } = params;

  // Получаем данные о кандидатах из Zustand хранилища
  const candidates = useCandidates((state) => state.data);

  // Ищем кандидата с соответствующим id
  const candidateId = Number(id);

  return (
    <div className={cn("w-full")}>
      <AddingEmployee id={candidateId} />
    </div>
  );
};

export default DashboardCandidatesAdmin;
