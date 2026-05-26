import { Card, Tabs } from "@/components/ui";
import { AuditTimeline, AuditTimelineEvent, WorkflowTimeline, WorkflowStepProps } from "@/components/workflow";
import { ApprovalHistory, ApprovalHistoryItem } from "@/components/approvals";
import { RequestCard, RequestCardProps } from "@/components/requests/request-card";

export interface RequestDetailProps {
  summary: RequestCardProps;
  requesterDetails: React.ReactNode;
  travelDetails: React.ReactNode;
  financialDetails: React.ReactNode;
  workflowSteps: WorkflowStepProps[];
  approvalHistory: ApprovalHistoryItem[];
  auditEvents: AuditTimelineEvent[];
  attachments?: React.ReactNode;
  comments?: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function RequestDetail({
  summary,
  requesterDetails,
  travelDetails,
  financialDetails,
  workflowSteps,
  approvalHistory,
  auditEvents,
  attachments,
  comments,
  activeTab,
  onTabChange,
}: RequestDetailProps) {
  return (
    <div className="request-detail">
      <RequestCard {...summary} />
      <Tabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={[
          { id: "details", label: "Details", content: <div className="detail-grid"><Card title="Requester">{requesterDetails}</Card><Card title="Travel">{travelDetails}</Card><Card title="Financial">{financialDetails}</Card></div> },
          { id: "workflow", label: "Workflow Timeline", content: <WorkflowTimeline steps={workflowSteps} /> },
          { id: "history", label: "Approval History", content: <ApprovalHistory items={approvalHistory} /> },
          { id: "attachments", label: "Attachments", content: attachments ?? <div className="component-state">No attachments.</div> },
          { id: "comments", label: "Comments", content: comments ?? <div className="component-state">No comments.</div> },
          { id: "audit", label: "Audit Log", content: <AuditTimeline events={auditEvents} /> },
        ]}
      />
    </div>
  );
}
