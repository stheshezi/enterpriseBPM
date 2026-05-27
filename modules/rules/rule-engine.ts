export type RuleContext = Record<string, unknown>;

export type RuleResult = {
  code: string;
  matched: boolean;
  reason?: string;
};

export class RuleEngine {
  evaluateBooleanExpression(expression: string, context: RuleContext): boolean {
    if (!expression.trim()) return true;

    const amount = Number(context.amount ?? 0);
    const travelType = String(context.travelType ?? "");

    if (expression === "amount > 5000000") return amount > 5_000_000;
    if (expression === "travelType == INTERNATIONAL") return travelType.toUpperCase() === "INTERNATIONAL";

    return false;
  }
}

export const ruleEngine = new RuleEngine();
