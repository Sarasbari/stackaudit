// ─── Tool definitions ────────────────────────────────────────────────────────

export type ToolId =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface PlanOption {
  id: string;
  label: string;
  pricePerSeat: number; // USD/month
  minSeats?: number;
  maxSeats?: number;
  notes?: string;
}

export interface ToolDefinition {
  id: ToolId;
  name: string;
  vendor: string;
  category: 'coding' | 'chat' | 'api';
  plans: PlanOption[];
  primaryUseCases: UseCase[];
  logoColor: string; // hex for the tool logo accent
}

// ─── Form state ──────────────────────────────────────────────────────────────

export interface ToolEntry {
  toolId: ToolId;
  planId: string;
  seats: number;
  monthlySpend: number; // what they actually pay (may differ from calculated)
  useManualSpend: boolean; // true = user typed a number, false = calculated
}

export interface FormState {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: ToolEntry[];
}

// ─── Audit types ─────────────────────────────────────────────────────────────

export type RecommendationType =
  | 'downgrade_plan'
  | 'reduce_seats'
  | 'switch_tool'
  | 'use_credits'
  | 'already_optimal';

export interface AuditRecommendation {
  type: RecommendationType;
  action: string;          // short action label e.g. "Switch to Pro"
  reason: string;          // 1-sentence defensible reason
  currentMonthlyCost: number;
  recommendedMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  alternativeToolId?: ToolId;
  alternativePlanId?: string;
}

export interface ToolAuditResult {
  toolEntry: ToolEntry;
  toolDef: ToolDefinition;
  currentPlan: PlanOption;
  recommendations: AuditRecommendation[];
  bestRecommendation: AuditRecommendation | null;
  isOptimal: boolean;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  formState: FormState;
  toolResults: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  savingsTier: 'high' | 'medium' | 'low' | 'optimal'; // >500 / 100-500 / <100 / 0
  aiSummary?: string;
}

// ─── Lead capture ─────────────────────────────────────────────────────────────

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
  totalMonthlySavings: number;
}
