import type { RequestStatus, WorkflowAction } from "@prisma/client";

export type StateRegistry = Partial<Record<RequestStatus, Partial<Record<WorkflowAction, RequestStatus>>>>;

export const DEFAULT_STATE_REGISTRY: StateRegistry = {
  SUBMITTED: { SUBMIT: "PENDING_LM" },
  PENDING_LM: { APPROVE: "PENDING_BUMA", REJECT: "REJECTED", CANCEL: "CANCELLED" },
  PENDING_BUMA: { APPROVE: "PENDING_C5", REJECT: "REJECTED", CANCEL: "CANCELLED" },
  PENDING_C5: { APPROVE: "PENDING_CEO", REJECT: "REJECTED", CANCEL: "CANCELLED" },
  PENDING_CEO: { APPROVE: "APPROVED", REJECT: "REJECTED", CANCEL: "CANCELLED" },
};

export class WorkflowStateMachine {
  constructor(private readonly registry: StateRegistry = DEFAULT_STATE_REGISTRY) {}

  transition(currentState: RequestStatus, action: WorkflowAction): RequestStatus {
    const nextState = this.registry[currentState]?.[action];

    if (!nextState) {
      throw new Error(`Invalid workflow transition: ${currentState} + ${action}.`);
    }

    return nextState;
  }
}

export const workflowStateMachine = new WorkflowStateMachine();
