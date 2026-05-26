import { WorkflowStep, WorkflowStepProps } from "@/components/workflow/workflow-step";

export interface WorkflowTimelineProps {
  steps: WorkflowStepProps[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function WorkflowTimeline({ steps, isLoading, emptyMessage = "No workflow steps yet." }: WorkflowTimelineProps) {
  if (isLoading) return <div className="component-state">Loading workflow...</div>;
  if (!steps.length) return <div className="component-state">{emptyMessage}</div>;

  return (
    <ol className="workflow-timeline">
      {steps.map((step, index) => <WorkflowStep key={`${step.title}-${index}`} {...step} />)}
    </ol>
  );
}
