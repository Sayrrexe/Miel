import { AddingEmployee } from "@/components/shared/dashboardAdmin/adminEmployeeAdding";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const DashboardCandidatesAdmin: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("w-full", className)}>
      <AddingEmployee />
    </div>
  );
};

export default DashboardCandidatesAdmin;
