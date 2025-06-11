import { RedLoadingSpinner } from "./loading-spinner"

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center space-y-4 bg-white p-8 rounded-lg">
        <RedLoadingSpinner size="lg" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
          <p className="text-gray-500">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    </div>
  )
}
