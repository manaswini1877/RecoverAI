import React from 'react';
import {
  Zap,
  Activity,
  UserCheck,
  ShieldCheck,
  KeyRound,
  Sparkles,
  RefreshCw,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export type PipelineStage =
  | 'event'
  | 'diagnose'
  | 'understand'
  | 'protect'
  | 'verify_scope'
  | 'decide'
  | 'recover'
  | 'measure';

interface PipelineStageBarProps {
  currentStage?: PipelineStage;
  status?: 'normal' | 'blocked' | 'escalated' | 'completed';
  className?: string;
}

const STAGES: Array<{ id: PipelineStage; label: string; icon: React.ReactNode }> = [
  { id: 'event', label: 'Event', icon: <Zap className="w-3.5 h-3.5" /> },
  { id: 'diagnose', label: 'Diagnose', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'understand', label: 'Understand', icon: <UserCheck className="w-3.5 h-3.5" /> },
  { id: 'protect', label: 'Protect', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  { id: 'verify_scope', label: 'Verify Scope', icon: <KeyRound className="w-3.5 h-3.5" /> },
  { id: 'decide', label: 'Decide', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'recover', label: 'Recover', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  { id: 'measure', label: 'Measure', icon: <BarChart3 className="w-3.5 h-3.5" /> },
];

export const PipelineStageBar: React.FC<PipelineStageBarProps> = ({
  currentStage = 'decide',
  status = 'normal',
  className = '',
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={`w-full overflow-x-auto py-2 ${className}`}>
      <div className="flex items-center min-w-[700px] justify-between relative">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2 z-0" />

        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          let badgeColor = 'bg-surface border-border text-subtle';
          let textColor = 'text-subtle';

          if (isCompleted) {
            badgeColor = 'bg-mint/15 border-mint/40 text-mint';
            textColor = 'text-mint font-medium';
          } else if (isCurrent) {
            if (status === 'blocked') {
              badgeColor = 'bg-coral/20 border-coral text-coral shadow-glow-coral animate-pulse';
              textColor = 'text-coral font-semibold';
            } else if (status === 'escalated') {
              badgeColor = 'bg-amber/20 border-amber text-amber';
              textColor = 'text-amber font-semibold';
            } else {
              badgeColor = 'bg-primary/20 border-primary text-primary-bright shadow-glow-violet animate-pulse';
              textColor = 'text-primary-bright font-semibold';
            }
          }

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${badgeColor}`}
              >
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.icon}
              </div>
              <span className={`text-[11px] mt-1.5 whitespace-nowrap ${textColor}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
