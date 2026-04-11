import { useState, useEffect } from 'react';
import { Heart, Zap, Moon } from 'lucide-react';
import { getPhaseInfo, getAllPhases } from '../utils/cycleUtils';

export default function CyclePhaseWheel({ cycleData, selectedDay }) {
  const [currentDay, setCurrentDay] = useState(selectedDay || 14);
  const cycleLength = cycleData?.cycleLength || 28;
  const phases = getAllPhases(cycleLength);

  // Get current phase based on day
  const getCurrentPhase = (day) => {
    return phases.find(p => day >= p.range[0] && day <= p.range[1]);
  };

  const currentPhase = getCurrentPhase(currentDay);

  // Generate SVG arc path using Math.cos/Math.sin
  const generateArcPath = (startAngle, endAngle, radius) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 140 + radius * Math.cos(startRad);
    const y1 = 140 + radius * Math.sin(startRad);
    const x2 = 140 + radius * Math.cos(endRad);
    const y2 = 140 + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Generate phase arcs
  const generatePhaseArcs = () => {
    const totalDegrees = 360;
    const degreesPerDay = totalDegrees / cycleLength;

    return phases.map((phase, index) => {
      const startDay = phase.range[0];
      const endDay = phase.range[1];
      const startAngle = (startDay - 1) * degreesPerDay;
      const endAngle = endDay * degreesPerDay;

      const isActive = currentDay >= startDay && currentDay <= endDay;
      const radius = 110;

      return (
        <g key={phase.name}>
          {/* Phase arc */}
          <path
            d={generateArcPath(startAngle, endAngle, radius)}
            stroke={phase.color}
            strokeWidth={isActive ? 3 : 2}
            fill="none"
            style={{
              filter: isActive ? `drop-shadow(0 0 12px ${phase.color}80)` : 'none',
              opacity: isActive ? 1 : 0.7,
              transition: 'all 300ms ease',
            }}
          />

          {/* Phase label */}
          {(endDay - startDay > 2 || cycleLength < 24) && (
            <text
              x={140 + 125 * Math.cos(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))}
              y={140 + 125 * Math.sin(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono text-xs"
              fill={phase.color}
              style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px' }}
            >
              {phase.name}
            </text>
          )}
        </g>
      );
    });
  };

  // 28-day mini calendar
  const renderMiniCalendar = () => {
    const days = Array.from({ length: cycleLength }, (_, i) => i + 1);

    return (
      <div className="mt-6 space-y-3">
        <label className="text-xs uppercase font-mono tracking-widest text-copper">Day {currentDay} of {cycleLength}</label>
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => {
            const dayPhase = getCurrentPhase(day);
            const isToday = day === currentDay;
            const isPast = day < currentDay;

            return (
              <button
                key={day}
                onClick={() => setCurrentDay(day)}
                className={`h-10 rounded-lg text-xs font-mono transition-all duration-200 ${
                  isToday
                    ? 'bg-copper text-kurobeni font-semibold ring-2 ring-copper'
                    : isPast
                    ? 'bg-blackberry/40 text-ivory/60 border border-copper/20'
                    : 'bg-blackberry/20 text-ivory/40 border border-copper/10'
                }`}
                style={
                  !isToday && dayPhase
                    ? {
                        backgroundColor: dayPhase.rgbaFill,
                        borderColor: dayPhase.color,
                        borderWidth: '1px',
                      }
                    : {}
                }
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* SVG Wheel Container */}
      <div className="flex justify-center">
        <svg width="280" height="280" viewBox="0 0 280 280" className="drop-shadow-lg">
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r="135"
            fill="rgba(40, 24, 34, 0.3)"
            stroke="rgba(197, 156, 121, 0.15)"
            strokeWidth="1"
          />

          {/* Phase arcs */}
          {generatePhaseArcs()}

          {/* Center glass circle */}
          <g filter="url(#glass-filter)">
            <circle
              cx="140"
              cy="140"
              r="55"
              fill="rgba(72, 25, 46, 0.6)"
              stroke="rgba(197, 156, 121, 0.4)"
              strokeWidth="1"
            />
            <circle
              cx="140"
              cy="140"
              r="54"
              fill="none"
              stroke="rgba(197, 156, 121, 0.15)"
              strokeWidth="1"
              opacity="0.5"
            />
          </g>

          {/* Day number */}
          <text
            x="140"
            y="130"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '48px',
              fontFamily: 'Cormorant Garamond, serif',
              fontWeight: 400,
              fill: '#c59c79',
            }}
          >
            {currentDay}
          </text>

          {/* Day label */}
          <text
            x="140"
            y="155"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              letterSpacing: '1px',
              fill: 'rgba(149, 112, 131, 0.7)',
              textTransform: 'uppercase',
            }}
          >
            Day
          </text>

          {/* Glass effect filter */}
          <defs>
            <filter id="glass-filter">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Mini Calendar Strip */}
      {renderMiniCalendar()}

      {/* Phase Info Card */}
      {currentPhase && (
        <div className="glass-card border border-copper/20 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif italic text-copper">{currentPhase.name} Phase</h2>
            <p className="text-xs uppercase font-mono tracking-widest text-ivory/50">
              Day {currentPhase.range[0]}-{currentPhase.range[1]} of {cycleLength}
            </p>
          </div>

          <p className="text-sm font-light leading-relaxed text-ivory/80">
            {currentPhase.description}
          </p>

          {/* Info chips */}
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="glass-pill border border-copper/30 rounded-full px-4 py-2 flex items-center gap-2">
              <Heart className="w-3 h-3 text-copper" />
              <span className="text-xs font-mono text-copper uppercase tracking-widest">
                {currentPhase.mood}
              </span>
            </div>
            <div className="glass-pill border border-copper/30 rounded-full px-4 py-2 flex items-center gap-2">
              <Zap className="w-3 h-3 text-copper" />
              <span className="text-xs font-mono text-copper uppercase tracking-widest">
                {currentPhase.energy}
              </span>
            </div>
            <div className="glass-pill border border-copper/30 rounded-full px-4 py-2 flex items-center gap-2">
              <Moon className="w-3 h-3 text-copper" />
              <span className="text-xs font-mono text-copper uppercase tracking-widest">
                {currentPhase.icon}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Helpful tip */}
      <div className="bg-copper/5 border border-copper/20 rounded-lg p-4">
        <p className="text-xs text-ivory/70 leading-relaxed">
          💡 <span className="font-mono text-copper">Tip:</span> Logging symptoms on the right day helps AI understand your unique cycle patterns.
        </p>
      </div>
    </div>
  );
}
