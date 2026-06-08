import { notFound } from "next/navigation";
import { PageContainer, PageHeader } from "@/components/layout";
import { Card } from "@/components/ui";
import { PERMISSIONS } from "@/config/permissions";
import { requirePermission } from "@/lib/access-control";
import { getRequestDetailByNumber } from "@/lib/workflow-read-model";
import { hierarchyTraversalService } from "@/modules/authority/hierarchy-traversal-service";
import { SupportReassignForm } from "@/components/admin/support-reassign-form";
import { SupportRerunForm } from "@/components/admin/support-rerun-form";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SupportRequestDetailPage({ params }: { params: { requestNumber: string } }) {
  const user = await requirePermission(PERMISSIONS.USERS_VIEW);
  
  let request;
  try {
    request = await getRequestDetailByNumber(params.requestNumber, user);
  } catch (e) {
    notFound();
  }

  // 1. Status Query info
  const currentTask = request.currentTask;

  // 2. AD Hierarchy Diagnostics
  // The original requester ID
  const originalRequesterId = await prisma.request.findUnique({
    where: { requestNumber: params.requestNumber },
    select: { requesterId: true }
  }).then(res => res?.requesterId);

  let chain: any[] = [];
  if (originalRequesterId) {
    chain = await hierarchyTraversalService.snapshotChain(originalRequesterId, user.tenantId);
  }

  // Required BUMA, C5, CEO checks typically look for users with specific AuthorityLevels.
  // We'll list the chain so the admin can identify where it breaks.
  const allUsers = await prisma.user.findMany({
    where: { tenantId: user.tenantId, active: true },
    select: { id: true, email: true, firstName: true, lastName: true }
  });

  return (
    <PageContainer>
      <PageHeader 
        title={`Support Diagnostics: ${request.requestNumber}`}
        description="Investigate workflow status, reassign tasks, and diagnose AD reporting chains."
      />

      <div className="stack">
        <Card title="1. Status Query (Where is my RFA?)">
          <div className="profile-grid">
            <span>Workflow Status <strong>{request.status}</strong></span>
            <span>Current Step <strong>{request.currentStep}</strong></span>
            <span>Current Assignee <strong>{currentTask?.assignee || "Unassigned"}</strong></span>
            <span>Requester <strong>{request.requester}</strong></span>
            <span>Created At <strong>{request.createdAt}</strong></span>
          </div>
        </Card>

        {currentTask && currentTask.status === "PENDING" && (
          <Card title="2. Routing Issue (Reassign Task)">
            <p className="text-sm text-gray-500 mb-4">
              If the task has been routed to the wrong person, or the assignee is unavailable, reassign it here.
            </p>
            <SupportReassignForm 
              taskId={currentTask.id} 
              currentAssignee={currentTask.assignee} 
              users={allUsers.map(u => ({ id: u.id, name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email }))} 
            />
          </Card>
        )}

        <Card title="3. Assignment Issue (AD Attribute Diagnostics)">
          <p className="text-sm text-gray-500 mb-4">
            Workflow assignment often breaks when Line Manager, BUMA, C5, or CEO attributes are missing. Below is the AD reporting hierarchy for the requester.
          </p>
          <div className="live-list">
            {chain.map((link, index) => {
              const hasManager = !!link.managerId;
              const isMissingLink = index === chain.length - 1 && !hasManager;
              return (
                <div key={link.userId} className={`p-4 border rounded ${isMissingLink ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex justify-between">
                    <div>
                      <strong>{link.email}</strong>
                      <span className="block text-sm text-gray-500">Authority Level: {link.authorityLevel || "None"}</span>
                    </div>
                    <div>
                      {hasManager ? (
                        <span className="text-green-600 text-sm font-medium">Manager Linked ✓</span>
                      ) : (
                        <span className="text-red-600 text-sm font-medium">No Manager Linked ⚠</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {chain.length === 0 && <p className="component-state">Could not determine AD hierarchy.</p>}
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Rerun Assignment Logic</h3>
            <p className="text-sm text-gray-500 mb-4">
              If you have corrected the missing AD attributes in the user's profile, you can rerun the assignment logic for the current step.
            </p>
            {currentTask && currentTask.status === "PENDING" ? (
              <SupportRerunForm taskId={currentTask.id} />
            ) : (
              <p className="text-sm text-gray-400">No pending task available to rerun.</p>
            )}
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
