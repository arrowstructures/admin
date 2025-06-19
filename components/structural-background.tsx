interface StructuralBackgroundProps {
  className?: string
  opacity?: number
}

export function StructuralBackground({ className = "", opacity = 0.15 }: StructuralBackgroundProps) {
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
  
    </div>
  )
}
