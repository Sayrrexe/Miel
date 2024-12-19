import { Favored } from "@/components/shared";
import { cn } from "@/lib/utils";
interface Props {
  className?: string;
}

const dashboardBossfavored: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <main>
        <Favored />
      </main>
    </div>
  );
};

export default dashboardBossfavored;
