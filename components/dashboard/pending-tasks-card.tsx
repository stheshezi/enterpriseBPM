import { Button, Card } from "@/components/ui";

export type PendingTaskItem = {
  id: string;
  title: string;
  requestNumber: string;
  dueDate?: string;
  slaStatus: "on-time" | "at-risk" | "overdue";
  assignedDate?: string;
};

export interface PendingTasksCardProps {
  tasks: PendingTaskItem[];
  isLoading?: boolean;
  onOpenTask?: (taskId: string) => void;
}

export function PendingTasksCard({ tasks, isLoading, onOpenTask }: PendingTasksCardProps) {
  return (
    <Card title="Pending tasks">
      {isLoading ? <div className="component-state">Loading tasks...</div> : null}
      {!isLoading && !tasks.length ? <div className="component-state">No pending tasks.</div> : null}
      {tasks.map((task) => (
        <div className={`task-row task-row--${task.slaStatus}`} key={task.id}>
          <div>
            <strong>{task.title}</strong>
            <p>{task.requestNumber} • Due {task.dueDate ?? "not set"}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => onOpenTask?.(task.id)}>Open Task</Button>
        </div>
      ))}
    </Card>
  );
}
