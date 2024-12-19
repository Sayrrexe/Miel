import { CandidateNewAdd } from "@/components/shared/dashboardAdmin/candidateAdding";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const Dashboard_adminka: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <CandidateNewAdd />
    </div>
  );
};

export default Dashboard_adminka;
