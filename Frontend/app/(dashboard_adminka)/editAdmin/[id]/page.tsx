import { EditAdmin } from "@/components/shared/dashboardAdmin/editAdmin/editAdmin";
import { cn } from "@/lib/utils";

export default function DashboardAdmin() {
  return (
    <div className={cn("mt-[52px] ml-10")}>
      <EditAdmin />
    </div>
  );
}