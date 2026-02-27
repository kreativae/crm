interface LoadingSkeletonProps {
  type: 'card' | 'table' | 'list' | 'chart' | 'kanban' | 'text';
  rows?: number;
  columns?: number;
}

const Shimmer = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <div className={`relative overflow-hidden rounded-lg bg-gray-200/60 ${className}`} style={style}>
    <div 
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  </div>
);

export default function LoadingSkeleton({ type, rows = 5, columns = 4 }: LoadingSkeletonProps) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <Shimmer className="w-10 h-10 rounded-xl" />
              <Shimmer className="w-16 h-6" />
            </div>
            <Shimmer className="w-24 h-8 mb-2" />
            <Shimmer className="w-32 h-4" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          {Array.from({ length: columns }).map((_, i) => (
            <Shimmer key={i} className={`h-4 ${i === 0 ? 'w-8' : 'flex-1'}`} />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0" style={{ animationDelay: `${r * 80}ms` }}>
            <Shimmer className="w-8 h-8 rounded-full" />
            {Array.from({ length: columns - 1 }).map((_, c) => (
              <Shimmer key={c} className={`h-4 flex-1 ${c === 0 ? 'max-w-[200px]' : 'max-w-[120px]'}`} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center gap-4" style={{ animationDelay: `${i * 80}ms` }}>
            <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="w-20 h-7 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <Shimmer className="w-40 h-6" />
          <Shimmer className="w-24 h-8 rounded-lg" />
        </div>
        <div className="flex items-end gap-3 h-48">
          {Array.from({ length: 7 }).map((_, i) => (
            <Shimmer 
              key={i} 
              className="flex-1 rounded-t-lg" 
              style={{ height: `${30 + Math.random() * 70}%`, animationDelay: `${i * 100}ms` } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'kanban') {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 3 }).map((_, col) => (
          <div key={col} className="min-w-[280px] flex-shrink-0" style={{ animationDelay: `${col * 150}ms` }}>
            <div className="flex items-center gap-3 mb-4">
              <Shimmer className="w-3 h-3 rounded-full" />
              <Shimmer className="w-24 h-5" />
              <Shimmer className="w-6 h-5 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 - col }).map((_, card) => (
                <div key={card} className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                  <Shimmer className="h-4 w-full" />
                  <div className="flex items-center gap-2">
                    <Shimmer className="w-6 h-6 rounded-full" />
                    <Shimmer className="h-3 w-20" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Shimmer className="h-5 w-16 rounded-full" />
                    <Shimmer className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // text
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Shimmer key={i} className={`h-4 ${i % 3 === 2 ? 'w-2/3' : 'w-full'}`} style={{ animationDelay: `${i * 60}ms` } as React.CSSProperties} />
      ))}
    </div>
  );
}
