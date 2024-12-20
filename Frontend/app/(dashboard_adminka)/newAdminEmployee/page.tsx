import { AddingEmployee } from "@/components/shared/dashboardAdmin/adminEmployeeAdding";
import { cn } from "@/lib/utils";
const DashboardCandidatesAdmin = () => {
  return (
    <div className={cn("w-full")}>
      <AddingEmployee />
    </div>
  );
};

export default DashboardCandidatesAdmin;
