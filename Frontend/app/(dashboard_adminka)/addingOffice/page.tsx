import { AddingOffice } from "@/components/shared/dashboardAdmin/adminAddingOffice";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const Dashboard_adminka: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <AddingOffice />
    </div>
  );
};

export default Dashboard_adminka;
