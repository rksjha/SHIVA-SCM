import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, color = 'primary', trend, trendLabel, subtext }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__icon">
        {Icon && <Icon size={22} />}
      </div>
      <div className="stats-card__content">
        <div className="stats-card__value">{value}</div>
        <div className="stats-card__label">{label}</div>
        {(trend !== undefined || subtext) && (
          <div className="stats-card__meta">
            {trend !== undefined && (
              <span className={`stats-trend ${trend >= 0 ? 'up' : 'down'}`}>
                {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(trend)}%
              </span>
            )}
            {trendLabel && <span className="stats-trend-label">{trendLabel}</span>}
            {subtext && <span className="stats-subtext">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
