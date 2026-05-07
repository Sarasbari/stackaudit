import { ChevronDown, Trash2, Plus, DollarSign, Users } from 'lucide-react';
import { TOOL_DEFINITIONS, TOOL_MAP } from '../../data/tools';
import type { ToolEntry, ToolId } from '../../types';
import { useState } from 'react';
import clsx from 'clsx';

// ─── ToolCard ────────────────────────────────────────────────────────────────

interface ToolCardProps {
  entry: ToolEntry;
  onUpdate: (updated: ToolEntry) => void;
  onRemove: () => void;
}

export function ToolCard({ entry, onUpdate, onRemove }: ToolCardProps) {
  const tool = TOOL_MAP[entry.toolId];
  if (!tool) return null;

  const plan = tool.plans.find(p => p.id === entry.planId) ?? tool.plans[0];
  const isApi = plan.pricePerSeat === 0 && plan.notes?.toLowerCase().includes('token');

  function changePlan(planId: string) {
    const newPlan = tool.plans.find(p => p.id === planId);
    if (!newPlan) return;
    const isApiPlan = newPlan.pricePerSeat === 0 && newPlan.notes?.toLowerCase().includes('token');
    onUpdate({
      ...entry,
      planId,
      monthlySpend: isApiPlan ? entry.monthlySpend : newPlan.pricePerSeat * entry.seats,
      useManualSpend: isApiPlan,
    });
  }

  function changeSeats(seats: number) {
    const s = Math.max(1, seats);
    onUpdate({
      ...entry,
      seats: s,
      monthlySpend: entry.useManualSpend ? entry.monthlySpend : plan.pricePerSeat * s,
    });
  }

  function changeSpend(spend: number) {
    onUpdate({ ...entry, monthlySpend: Math.max(0, spend), useManualSpend: true });
  }

  return (
    <div className="bg-[#0f1712] border border-[#1e2e24] rounded-2xl p-5 group hover:border-[#263d30] transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: tool.logoColor + '22', color: tool.logoColor }}
          >
            {tool.name.charAt(0)}
          </div>
          <div>
            <div className="font-display font-600 text-[#f0f7f2] text-sm">{tool.name}</div>
            <div className="text-[10px] text-[#4d7a60]">{tool.vendor}</div>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="opacity-0 group-hover:opacity-100 text-[#4d7a60] hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-400/10"
          aria-label={`Remove ${tool.name}`}
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Plan selector */}
        <div>
          <label className="text-[9px] font-display font-600 text-[#4d7a60] uppercase tracking-wider mb-1 block">
            Plan
          </label>
          <div className="relative">
            <select
              value={entry.planId}
              onChange={e => changePlan(e.target.value)}
              className="w-full appearance-none bg-[#162119] border border-[#1e2e24] focus:border-[#22c55e66] rounded-xl px-3 py-2 text-[#f0f7f2] text-xs outline-none transition-colors pr-8 cursor-pointer"
            >
              {tool.plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label} {p.pricePerSeat > 0 ? `($${p.pricePerSeat}/seat)` : ''}
                </option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#4d7a60] pointer-events-none" />
          </div>
        </div>

        {/* Seats */}
        {!isApi && (
          <div>
            <label className="text-[9px] font-display font-600 text-[#4d7a60] uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users size={9} /> Seats
            </label>
            <input
              type="number"
              min={plan.minSeats ?? 1}
              max={plan.maxSeats}
              value={entry.seats}
              onChange={e => changeSeats(parseInt(e.target.value) || 1)}
              className="w-full bg-[#162119] border border-[#1e2e24] focus:border-[#22c55e66] rounded-xl px-3 py-2 text-[#f0f7f2] text-xs outline-none transition-colors font-mono"
            />
          </div>
        )}

        {/* Monthly spend */}
        <div>
          <label className="text-[9px] font-display font-600 text-[#4d7a60] uppercase tracking-wider mb-1 flex items-center gap-1">
            <DollarSign size={9} /> {isApi ? 'Monthly Invoice' : 'Monthly'}
          </label>
          {isApi ? (
            <input
              type="number"
              min={0}
              step={10}
              value={entry.monthlySpend}
              onChange={e => changeSpend(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 250"
              className="w-full bg-[#162119] border border-[#1e2e24] focus:border-[#22c55e66] rounded-xl px-3 py-2 text-[#f0f7f2] text-xs outline-none transition-colors font-mono"
            />
          ) : (
            <div className="bg-[#162119] border border-[#1e2e24] rounded-xl px-3 py-2 text-xs font-mono text-[#22c55e]">
              ${entry.monthlySpend.toFixed(0)}
            </div>
          )}
        </div>
      </div>

      {/* Plan note */}
      {plan.notes && (
        <div className="mt-3 text-[10px] text-[#4d7a60] font-mono">
          ℹ {plan.notes}
        </div>
      )}
    </div>
  );
}

// ─── AddToolPicker ───────────────────────────────────────────────────────────

interface AddToolPickerProps {
  addedToolIds: string[];
  onAdd: (toolId: string) => void;
}

export function AddToolPicker({ addedToolIds, onAdd }: AddToolPickerProps) {
  const [open, setOpen] = useState(false);
  const available = TOOL_DEFINITIONS.filter(t => !addedToolIds.includes(t.id));

  if (available.length === 0) {
    return (
      <div className="text-center text-[10px] text-[#263d30] py-3">
        All available tools have been added
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          'w-full border-2 border-dashed rounded-2xl py-3.5 flex items-center justify-center gap-2 text-sm transition-all',
          open
            ? 'border-[#22c55e44] bg-[#22c55e08] text-[#4ade80]'
            : 'border-[#1e2e24] text-[#4d7a60] hover:border-[#263d30] hover:text-[#8aab96]'
        )}
      >
        <Plus size={16} />
        <span className="font-display font-500">Add a tool</span>
      </button>

      {open && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {available.map(tool => (
            <button
              key={tool.id}
              onClick={() => { onAdd(tool.id); setOpen(false); }}
              className="bg-[#0f1712] border border-[#1e2e24] hover:border-[#263d30] rounded-xl px-3 py-3 text-left transition-all group"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold"
                  style={{ backgroundColor: tool.logoColor + '22', color: tool.logoColor }}
                >
                  {tool.name.charAt(0)}
                </div>
                <span className="font-display font-500 text-[#f0f7f2] text-xs group-hover:text-[#4ade80] transition-colors">
                  {tool.name}
                </span>
              </div>
              <div className="text-[9px] text-[#4d7a60]">
                from ${tool.plans.find(p => p.pricePerSeat > 0)?.pricePerSeat ?? 0}/seat
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
