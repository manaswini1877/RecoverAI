import React from 'react';
import { HelpCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  tooltip: string;
  badge?: string;
  variant?: 'default' | 'mint' | 'amber' | 'violet' | 'coral';
  icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  isPositive = true,
  tooltip,
  badge,
  variant = 'default',
  icon,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const glowStyles = {
    default: 'hover:border-border-light',
    mint: 'hover:border-mint/50 hover:shadow-glow-mint',
    amber: 'hover:border-amber/50',
    violet: 'hover:border-primary/50 hover:shadow-glow-violet',
    coral: 'hover:border-coral/50 hover:shadow-glow-coral',
  };

  const textStyles = {
    default: 'text-main',
    mint: 'text-mint',
    amber: 'text-amber',
    violet: 'text-primary-bright',
    coral: 'text-coral',
  };

  return (
    <div
      className={`relative bg-surface border border-border rounded-xl p-4 transition-all duration-200 ${glowStyles[variant]} flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-muted uppercase tracking-wider">{label}</span>
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="text-subtle hover:text-muted transition-colors"
              aria-label="Metric information"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </button>
            {showTooltip && (
              <div className="absolute left-0 bottom-full mb-1.5 z-30 w-52 p-2 bg-surface-highlight border border-border text-[11px] text-main rounded-lg shadow-card">
                {tooltip}
              </div>
            )}
          </div>
        </div>

        {icon && <div className="text-muted">{icon}</div>}
        {badge && (
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-surface-highlight border border-border text-muted">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className={`text-2xl font-bold font-mono tracking-tight ${textStyles[variant]}`}>
          {value}
        </div>

        {change && (
          <div
            className={`flex items-center text-xs font-mono font-medium ${
              isPositive ? 'text-mint' : 'text-coral'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" />}
            {change}
          </div>
        )}
      </div>
    </div>
  );
};
