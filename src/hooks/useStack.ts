import { useMemo } from 'react';
import { v4 as uuid } from 'uuid';
import type {
  AuditRecommendation,
  AuditResult,
  FormState,
  ToolAuditResult,
  ToolEntry,
} from '../types';
import { TOOL_DEFINITIONS, TOOL_MAP } from '../data/tools';

// ── Helpers ────────────────────────────────────────────────────────

function findCheaperAlternatives(
  entry: ToolEntry,
  formState: FormState,
): AuditRecommendation[] {
  const recs: AuditRecommendation[] = [];
  const def = TOOL_MAP[entry.toolId];
  if (!def) return recs;

  const currentCost = entry.monthlySpend;

  // 1) Downgrade within same tool
  for (const plan of def.plans) {
    if (plan.id === entry.planId) continue;
    const altCost = plan.pricePerSeat * entry.seats;
    if (altCost < currentCost && altCost >= 0) {
      const savings = currentCost - altCost;
      recs.push({
        type: 'downgrade_plan',
        action: `Downgrade to ${plan.label}`,
        reason: `${plan.label} at $${plan.pricePerSeat}/seat covers most use cases and saves $${savings}/mo.`,
        currentMonthlyCost: currentCost,
        recommendedMonthlyCost: altCost,
        monthlySavings: savings,
        annualSavings: savings * 12,
        alternativePlanId: plan.id,
      });
    }
  }

  // 2) Reduce seats if seats > team size
  if (entry.seats > formState.teamSize) {
    const plan = def.plans.find(p => p.id === entry.planId);
    if (plan) {
      const altCost = plan.pricePerSeat * formState.teamSize;
      const savings = currentCost - altCost;
      if (savings > 0) {
        recs.push({
          type: 'reduce_seats',
          action: `Reduce to ${formState.teamSize} seats`,
          reason: `You have ${entry.seats} seats but a team of ${formState.teamSize}. Remove unused seats.`,
          currentMonthlyCost: currentCost,
          recommendedMonthlyCost: altCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
        });
      }
    }
  }

  // 3) Switch to a cheaper competing tool
  const competitors = TOOL_DEFINITIONS.filter(
    t =>
      t.id !== def.id &&
      t.category === def.category &&
      t.primaryUseCases.some(uc => def.primaryUseCases.includes(uc)),
  );

  for (const alt of competitors) {
    for (const altPlan of alt.plans) {
      const altCost = altPlan.pricePerSeat * entry.seats;
      if (altCost < currentCost) {
        const savings = currentCost - altCost;
        recs.push({
          type: 'switch_tool',
          action: `Switch to ${alt.name} ${altPlan.label}`,
          reason: `${alt.name} (${altPlan.label}) offers similar capabilities at $${altPlan.pricePerSeat}/seat.`,
          currentMonthlyCost: currentCost,
          recommendedMonthlyCost: altCost,
          monthlySavings: savings,
          annualSavings: savings * 12,
          alternativeToolId: alt.id,
          alternativePlanId: altPlan.id,
        });
      }
    }
  }

  // Sort by biggest savings first
  recs.sort((a, b) => b.monthlySavings - a.monthlySavings);

  return recs;
}

function getSavingsTier(savings: number): AuditResult['savingsTier'] {
  if (savings === 0) return 'optimal';
  if (savings < 100) return 'low';
  if (savings <= 500) return 'medium';
  return 'high';
}

// ── Hook ───────────────────────────────────────────────────────────

export function useAudit(formState: FormState): AuditResult {
  return useMemo(() => {
    const toolResults: ToolAuditResult[] = formState.tools.map(entry => {
      const toolDef = TOOL_MAP[entry.toolId]!;
      const currentPlan = toolDef.plans.find(p => p.id === entry.planId)!;
      const recommendations = findCheaperAlternatives(entry, formState);

      const bestRecommendation = recommendations.length > 0 ? recommendations[0] : null;
      const isOptimal = recommendations.length === 0;

      // If no savings possible, add an "already optimal" entry
      if (isOptimal) {
        recommendations.push({
          type: 'already_optimal',
          action: 'No changes needed',
          reason: `${toolDef.name} on ${currentPlan.label} is the most cost-effective option for your setup.`,
          currentMonthlyCost: entry.monthlySpend,
          recommendedMonthlyCost: entry.monthlySpend,
          monthlySavings: 0,
          annualSavings: 0,
        });
      }

      return { toolEntry: entry, toolDef, currentPlan, recommendations, bestRecommendation, isOptimal };
    });

    const totalCurrentSpend = formState.tools.reduce((s, t) => s + t.monthlySpend, 0);
    const totalMonthlySavings = toolResults.reduce(
      (s, r) => s + (r.bestRecommendation?.monthlySavings ?? 0),
      0,
    );
    const totalAnnualSavings = totalMonthlySavings * 12;

    return {
      id: uuid(),
      createdAt: new Date().toISOString(),
      formState,
      toolResults,
      totalMonthlySavings,
      totalAnnualSavings,
      totalCurrentSpend,
      savingsTier: getSavingsTier(totalMonthlySavings),
    };
  }, [formState]);
}
