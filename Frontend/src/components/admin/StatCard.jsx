import React from 'react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend = 'up',
  trendValue,
  sparkline = '34,58 58,56 82,42 106,47 130,34 154,54 178,68 202,60 226,64 250,45 274,34 298,52 322,66 346,60 370,64 394,40',
}) => {
  const isUp = trend === 'up';
  const gradientId = `spark-${title.replace(/\s+/g, '-')}`;

  return (
    <div className="relative min-h-[186px] overflow-hidden rounded-2xl border border-[#eadbd6] bg-white p-5 shadow-[0_14px_34px_rgba(80,24,18,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(80,24,18,0.1)]">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#f7eae5] text-[#9a1515]">
          <Icon className="h-7 w-7" />
        </div>
        <div className="min-w-0 pt-1">
          <p className="font-sans text-sm font-semibold text-[#5f3430]">{title}</p>
          <h3 className="mt-2 font-serif text-2xl font-black leading-none text-[#161111] sm:text-[26px]">
            {value}
          </h3>
        </div>
      </div>

      {trendValue && (
        <div className={`mt-5 inline-flex items-center gap-1.5 rounded-full text-xs font-bold ${isUp ? 'text-emerald-600' : 'text-red-600'}`}>
          <span>{isUp ? '↑' : '↓'} {trendValue}%</span>
          <span className="text-[11px] font-semibold text-[#6c5c58]">vs last week</span>
        </div>
      )}

      <svg className="mt-4 h-12 w-full overflow-visible" viewBox="0 0 428 80" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#a20d0d" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#a20d0d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`34,76 ${sparkline} 394,76`} fill={`url(#${gradientId})`} stroke="none" />
        <polyline points={sparkline} fill="none" stroke="#c52a2a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export default StatCard;
