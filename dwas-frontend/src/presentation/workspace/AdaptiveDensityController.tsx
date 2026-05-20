import { useWorkspaceStore } from '../stores/commandStore'

interface AdaptiveDensityControllerProps {
  className?: string
}

function AdaptiveDensityController({ className }: AdaptiveDensityControllerProps) {
  const { state, setDensity } = useWorkspaceStore()
  const { density } = state

  const densities = [
    { value: 'compact', label: 'Compact', description: 'Maximum information density' },
    { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'Relaxed layout' },
  ] as const

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {densities.map((d) => (
        <button
          key={d.value}
          onClick={() => setDensity(d.value)}
          className={`px-2 py-1 text-[10px] font-medium rounded border transition-colors ${
            density === d.value
              ? 'bg-[#DEEBFF] border-[#0052CC] text-[#172B4D]'
              : 'bg-[#FAFBFC] border-[#DFE1E6] text-[#6B778C] hover:text-[#44546F]'
          }`}
          title={d.description}
        >
          {d.label}
        </button>
      ))}
    </div>
  )
}

export default AdaptiveDensityController
