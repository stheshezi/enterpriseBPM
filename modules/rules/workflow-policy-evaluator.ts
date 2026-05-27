import { prisma } from "@/lib/prisma";
import { ruleEngine, type RuleContext, type RuleResult } from "@/modules/rules/rule-engine";

export class WorkflowPolicyEvaluator {
  async evaluate(tenantId: string, context: RuleContext): Promise<RuleResult[]> {
    const policies = await prisma.workflowPolicy.findMany({
      where: {
        tenantId,
        active: true,
      },
      orderBy: { createdAt: "asc" },
    });

    return policies.map((policy) => ({
      code: policy.code,
      matched: ruleEngine.evaluateBooleanExpression(policy.expression, context),
      reason: policy.name,
    }));
  }
}

export const workflowPolicyEvaluator = new WorkflowPolicyEvaluator();
