import React from "react";

export interface MatrixContainerProps {
  className?: string;
}

export const MatrixContainer: React.FC<MatrixContainerProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-6 ${className}`}
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Priority matrix view.
          </p>
        </div>
      </div>

      {/* Empty Container Body */}
      <div className="min-h-[500px] border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-600">Matrix</p>
      </div>
    </div>
  );
};

export default MatrixContainer;
