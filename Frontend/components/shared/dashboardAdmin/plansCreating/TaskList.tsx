// TaskList.tsx
import {Checkbox} from "@/components/ui";
import {Edit} from "@/components/ui/icons/edit"
import {Trash} from "@/components/ui/icons/trash"

interface Tasks {
  created_at: string;
  due_date: string;
  id: number;
  is_complete: boolean;
  is_deleted: boolean;
  task: string;
  user: string;
}

interface TaskListProps {
  tasks: Tasks[];
  title: string;
  filter: (task: Tasks) => boolean;
  onEdit?: (task: Tasks) => void;
  onDelete?: (task: Tasks) => void;
}

export const TaskList = ({
                           tasks,
                           title,
                           filter,
                           onEdit,
                           onDelete
                         }: TaskListProps) => {
  const filteredTasks = tasks.filter(filter);
  if (filteredTasks.length === 0) return null;

  return (
    <div>
      <p className="text-[#960047]">{title}</p>
      <div className="flex flex-col gap-[10px]">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className="mt-3 mb-3 w-full bg-[#d9f0f0] flex p-[15px] justify-between border-solid border-[1px] border-[#CACBCD]"
          >
            <div className="flex items-center gap-[10px]">
              <Checkbox className="w-6 h-6" />
              <p>{task.task}</p>
            </div>
            <div className="flex gap-[10px]">
              {onEdit && (
                <Edit
                  className="opacity-50 cursor-pointer"
                  onClick={() => onEdit(task)}
                />
              )}
              {onDelete && (
                <Trash
                  className="opacity-50 cursor-pointer"
                  onClick={() => onDelete(task)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};