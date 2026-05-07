import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, AlertCircle } from 'lucide-react';
import { ToolCard, AddToolPicker } from '../components/form/ToolCard';
import { usePersistedState } from '../hooks/usePersistedState';
import { TOOL_MAP, USE_CASES } from '../data/tools';
import type { FormState, ToolEntry, UseCase } from '../types';
import clsx from 'clsx';

const DEFAULT_FORM: FormState = {
  teamSize: 5,
  primaryUseCase: 'mixed',
  tools: [
    {
      toolId: 'cursor',
      planId: 'pro',
      seats: 3,
      monthlySpend: 60,
      useManualSpend: false,
    },
    {
      toolId: 'chatgpt',
      planId: 'team',
      seats: 5,
      monthlySpend: 150,
      useManualSpend: false,
    },
  ],
};

export default function SpendForm() {
  const navigate = useNavigate();
  const [form, setForm] = usePersistedState<FormState>(DEFAULT_FORM);

  const totalSpend = form.tools.reduce((sum, t) => sum + t.monthlySpend, 0);
  const hasTools = form.tools.length > 0;

  function updateTool(index: number, updated: ToolEntry) {
    setForm(f => {
      const tools = [...f.tools];
      tools[index] = updated;
      return { ...f, tools };
    });
  }

  function removeTool(index: number) {
    setForm(f => ({ ...f, tools: f.tools.filter((_, i) => i !== index) }));
  }

  function addTool(toolId: string) {
    const tool = TOOL_MAP[toolId];
    if (!tool) return;
    const plan = tool.plans[1] ?? tool.plans[0]; // default to 2nd plan (usually paid)
    const seats = Math.max(1, form.teamSize > 0 ? Math.ceil(form.teamSize / 2) : 1);
    setForm(f => ({
      ...f,
      tools: [
        ...f.tools,
        {
          toolId: tool.id,
          planId: plan.id,
          seats,
          monthlySpend: plan.pricePerSeat * seats,
          useManualSpend: false,
        },
      ],
    }));
  }

  function handleSubmit() {
    if (!hasTools) return;
    // Store form in sessionStorage for audit page to pick up
    sessionStorage.setItem('stackaudit_pending_form', JSON.stringify(form));
    navigate('/audit');
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav className="border-b border-[#1e2e24] bg-[#0a0f0d]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#22c55e] flex items-center justify-center">
              <Zap size={14} className="text-[#0a0f0d]" fill="currentColor" />
            </div>
            <span className="font-display font-700 text-[#f0f7f2] tracking-tight text-sm">StackAudit</span>
          </div>
          <span className="text-xs text-[#4d7a60] font-mono hidden sm:block">Free · No login required</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-14 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-[#22c55e11] border border-[#22c55e33] rounded-full px-4 py-1.5 text-xs font-mono text-[#4ade80] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          Free AI spend audit — results in 30 seconds
        </div>

        <h1
          className="text-4xl sm:text-5xl font-display font-800 text-[#f0f7f2] tracking-tight mb-4 leading-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Are you overpaying for<br />
          <span className="text-[#22c55e]">AI tools?</span>
        </h1>

        <p className="text-[#8aab96] text-base max-w-xl mx-auto mb-2">
          Enter your current AI stack. Get an instant audit showing exactly where
          you're overspending and how much you could save.
        </p>

        {totalSpend > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#8aab96]">
            <span className="font-mono text-[#f0f7f2] font-600">${totalSpend.toFixed(0)}/mo</span>
            <span>currently tracked</span>
            <span className="font-mono text-[#22c55e]">→</span>
            <span className="text-[#22c55e]">Run audit to see savings</span>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Context */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-[#0f1712] border border-[#1e2e24] rounded-2xl p-5">
              <h2 className="font-display font-600 text-[#f0f7f2] text-sm mb-4">
                About your team
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-display font-600 text-[#8aab96] uppercase tracking-wider mb-1.5 block">
                    Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.teamSize}
                    onChange={e => setForm(f => ({ ...f, teamSize: Math.max(1, parseInt(e.target.value) || 1) }))}
                    className="w-full bg-[#162119] border border-[#1e2e24] focus:border-[#22c55e66] rounded-xl px-3 py-2.5 text-[#f0f7f2] text-sm outline-none transition-colors font-mono"
                  />
                  <p className="text-[10px] text-[#4d7a60] mt-1.5">
                    Total people who use AI tools
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-display font-600 text-[#8aab96] uppercase tracking-wider mb-2 block">
                    Primary Use Case
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {USE_CASES.map(uc => (
                      <button
                        key={uc.id}
                        onClick={() => setForm(f => ({ ...f, primaryUseCase: uc.id as UseCase }))}
                        className={clsx(
                          'flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left text-sm transition-all',
                          form.primaryUseCase === uc.id
                            ? 'bg-[#22c55e15] border-[#22c55e44] text-[#4ade80]'
                            : 'border-[#1e2e24] text-[#8aab96] hover:border-[#263d30] hover:text-[#f0f7f2]'
                        )}
                      >
                        <span className="text-base">{uc.emoji}</span>
                        <span className="font-display font-500 text-xs">{uc.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary card */}
            {hasTools && (
              <div className="bg-[#0f1712] border border-[#1e2e24] rounded-2xl p-5">
                <div className="text-[10px] font-display font-600 text-[#8aab96] uppercase tracking-wider mb-3">
                  Tracked Spend
                </div>
                <div className="space-y-2">
                  {form.tools.map((t, i) => {
                    const tool = TOOL_MAP[t.toolId];
                    if (!tool) return null;
                    return (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-[#8aab96]">{tool.name}</span>
                        <span className="font-mono text-[#f0f7f2]">${t.monthlySpend.toFixed(0)}/mo</span>
                      </div>
                    );
                  })}
                  <div className="border-t border-[#1e2e24] pt-2 flex items-center justify-between text-sm font-600">
                    <span className="text-[#c8ddd0]">Total</span>
                    <span className="font-mono text-[#22c55e]">${totalSpend.toFixed(0)}/mo</span>
                  </div>
                  <div className="text-right text-[10px] text-[#4d7a60] font-mono">
                    ${(totalSpend * 12).toFixed(0)}/year
                  </div>
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="bg-[#0f1712] border border-[#1e2e24] rounded-2xl p-4 flex gap-3">
              <AlertCircle size={14} className="text-[#4d7a60] mt-0.5 shrink-0" />
              <p className="text-[10px] text-[#4d7a60] leading-relaxed">
                For API tools (Anthropic, OpenAI), enter your actual monthly invoice amount. 
                Seat-based tools are auto-calculated from your plan × seats.
              </p>
            </div>
          </div>

          {/* Right: Tool cards */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display font-600 text-[#f0f7f2] text-sm">
                Your AI tools <span className="text-[#4d7a60] font-400">({form.tools.length})</span>
              </h2>
              {form.tools.length > 0 && (
                <button
                  onClick={() => setForm(f => ({ ...f, tools: [] }))}
                  className="text-[10px] text-[#4d7a60] hover:text-red-400 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {form.tools.length === 0 && (
              <div className="bg-[#0f1712] border-2 border-dashed border-[#1e2e24] rounded-2xl p-10 text-center">
                <p className="text-[#4d7a60] text-sm mb-1">No tools added yet</p>
                <p className="text-[#263d30] text-xs">Add the AI tools your team pays for below</p>
              </div>
            )}

            {form.tools.map((entry, i) => (
              <ToolCard
                key={`${entry.toolId}-${i}`}
                entry={entry}
                onUpdate={updated => updateTool(i, updated)}
                onRemove={() => removeTool(i)}
              />
            ))}

            <AddToolPicker
              addedToolIds={form.tools.map(t => t.toolId)}
              onAdd={addTool}
            />

            {/* CTA */}
            {hasTools && (
              <button
                onClick={handleSubmit}
                className="w-full mt-2 bg-[#22c55e] hover:bg-[#4ade80] text-[#0a0f0d] font-display font-700 px-6 py-4 rounded-2xl transition-all duration-150 active:scale-98 flex items-center justify-center gap-2 text-base group"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Run AI Spend Audit
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}

            {!hasTools && (
              <div className="text-center text-xs text-[#263d30] pt-2">
                Add at least one tool to run the audit
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
