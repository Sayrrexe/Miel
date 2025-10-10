import { NewPlans } from "@/components/shared/dashboardAdmin/plansCreating";
import { cn } from "@/lib/utils";

const Dashboard_adminka = () => {
  return (
    <div className={cn("overflow-y-auto min-h-screen pb-10    ")}>
      <NewPlans />
    </div>
  );
};

export default Dashboard_adminka;
