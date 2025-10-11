import { NewPlans } from "@/components/shared/dashboardAdmin/plansCreating";
import { cn } from "@/lib/utils";

const Dashboard_adminka = () => {
  return (
    <div className={cn("h-[calc(100vh-72px)] overflow-y-auto pb-10")}>
      <NewPlans />
    </div>
  );
};

export default Dashboard_adminka;
