import { useCallback, useState } from 'react';
import type { FormState, ToolEntry, ToolId, UseCase } from '../types';
import { TOOL_MAP } from '../data/tools';

const DEFAULT_FORM: FormState = {
  teamSize: 1,
  primaryUseCase: 'coding',
  tools: [],
};

export function useFormState(initial?: Partial<FormState>) {
  const [form, setForm] = useState<FormState>({ ...DEFAULT_FORM, ...initial });

  const setTeamSize = useCallback((teamSize: number) => {
    setForm(f => ({ ...f, teamSize: Math.max(1, teamSize) }));
  }, []);

  const setUseCase = useCallback((primaryUseCase: UseCase) => {
    setForm(f => ({ ...f, primaryUseCase }));
  }, []);

  // ── Tool entries ─────────────────────────────────────────────

  const addTool = useCallback((toolId: ToolId, planId: string, seats?: number) => {
    const def = TOOL_MAP[toolId];
    if (!def) return;

    const plan = def.plans.find(p => p.id === planId);
    if (!plan) return;

    const seatCount = seats ?? 1;
    const monthlySpend = plan.pricePerSeat * seatCount;

    setForm(f => {
      // Don't add duplicates
      if (f.tools.some(t => t.toolId === toolId)) return f;
      const entry: ToolEntry = {
        toolId,
        planId,
        seats: seatCount,
        monthlySpend,
        useManualSpend: false,
      };
      return { ...f, tools: [...f.tools, entry] };
    });
  }, []);

  const removeTool = useCallback((toolId: ToolId) => {
    setForm(f => ({ ...f, tools: f.tools.filter(t => t.toolId !== toolId) }));
  }, []);

  const updateTool = useCallback((toolId: ToolId, patch: Partial<ToolEntry>) => {
    setForm(f => ({
      ...f,
      tools: f.tools.map(t => {
        if (t.toolId !== toolId) return t;

        const merged = { ...t, ...patch };

        // Recalculate spend unless manual
        if (!merged.useManualSpend) {
          const def = TOOL_MAP[toolId];
          const plan = def?.plans.find(p => p.id === merged.planId);
          merged.monthlySpend = plan ? plan.pricePerSeat * merged.seats : 0;
        }

        return merged;
      }),
    }));
  }, []);

  const setManualSpend = useCallback((toolId: ToolId, spend: number) => {
    setForm(f => ({
      ...f,
      tools: f.tools.map(t =>
        t.toolId === toolId
          ? { ...t, monthlySpend: spend, useManualSpend: true }
          : t,
      ),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setForm({ ...DEFAULT_FORM, ...initial });
  }, [initial]);

  // ── Derived ──────────────────────────────────────────────────

  const totalMonthlySpend = form.tools.reduce((s, t) => s + t.monthlySpend, 0);

  return {
    form,
    setTeamSize,
    setUseCase,
    addTool,
    removeTool,
    updateTool,
    setManualSpend,
    resetForm,
    totalMonthlySpend,
  };
}
