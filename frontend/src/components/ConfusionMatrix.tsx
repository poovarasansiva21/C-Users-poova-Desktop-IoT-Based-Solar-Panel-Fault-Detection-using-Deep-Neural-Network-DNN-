import React from 'react';

interface ConfusionMatrixProps {
  matrix?: number[][];
  classes?: string[];
}

export const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({
  matrix = [
    [157, 1, 2, 0, 0, 0],
    [0, 156, 3, 1, 0, 0],
    [1, 2, 155, 0, 2, 0],
    [0, 0, 1, 158, 1, 0],
    [1, 2, 2, 0, 155, 0],
    [0, 0, 0, 0, 1, 159]
  ],
  classes = ['NORMAL', 'SHADING', 'DUST', 'ELECTRICAL', 'LOW_POWER', 'OVERHEAT']
}) => {
  // Find max value in matrix for heat opacity
  const maxVal = Math.max(...matrix.flatMap((r) => r));

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-700/60 shadow-xl overflow-x-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Multi-Class Confusion Matrix</h3>
          <p className="text-xs text-slate-400">Ground Truth vs Model Classification on Test Split (960 samples)</p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          Diagonal Dominance &gt; 97%
        </span>
      </div>

      <div className="min-w-[500px]">
        {/* Top Header Labels (Predicted) */}
        <div className="text-center text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Predicted Class →
        </div>

        <table className="w-full text-center border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-[11px] font-mono text-slate-400 text-left w-28">
                Actual ↓
              </th>
              {classes.map((c) => (
                <th key={c} className="p-2 text-[11px] font-mono font-semibold text-slate-300">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIdx) => (
              <tr key={classes[rowIdx]}>
                <td className="p-2 text-[11px] font-mono font-semibold text-slate-400 text-left">
                  {classes[rowIdx]}
                </td>
                {row.map((val, colIdx) => {
                  const isDiagonal = rowIdx === colIdx;
                  const intensity = Math.min(1, val / maxVal);
                  return (
                    <td key={`${rowIdx}-${colIdx}`} className="p-1">
                      <div
                        className={`py-2 px-1 rounded-lg text-xs font-mono font-bold transition-all ${
                          isDiagonal
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : val > 0
                            ? 'bg-slate-800 text-slate-300'
                            : 'bg-slate-900/40 text-slate-600'
                        }`}
                        title={`Actual: ${classes[rowIdx]}, Predicted: ${classes[colIdx]} (${val})`}
                      >
                        {val}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Diagonal blocks represent accurate positive classifications.</span>
        <span className="font-mono text-amber-400">Low off-diagonal error</span>
      </div>
    </div>
  );
};
