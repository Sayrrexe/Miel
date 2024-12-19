import { AddingNewAdmin } from "@/components/shared/dashboardAdmin/adminAdding";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const Dashboard_adminka: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <AddingNewAdmin />
    </div>
  );
};

export default Dashboard_adminka;
