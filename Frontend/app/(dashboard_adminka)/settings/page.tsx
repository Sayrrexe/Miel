import { Settings } from "@/components/shared/dashboardAdmin/settings";
import { cn } from "@/lib/utils";

const Dashboard_adminka = () => {
  return (
    <div className={cn("overflow-y-auto h-full pb-10 w-full")}>
      <Settings />
    </div>
  );
};

export default Dashboard_adminka;
