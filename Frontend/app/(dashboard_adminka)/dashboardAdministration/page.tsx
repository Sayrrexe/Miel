import { FilterCategories } from "@/components/shared/dashboardAdmin/administrationPage";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const Dashboard_adminka: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <FilterCategories />
    </div>
  );
};

export default Dashboard_adminka;
