import React, { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class PanoramaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Panorama Error:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Panorama Loading Error
                </h3>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {this.state.error?.message || 'Something went wrong while loading the panorama viewer.'}
                </p>

                {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                  <details className="mb-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700 p-3 rounded-lg overflow-auto max-h-32">
                    <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Error Details
                    </summary>
                    <pre className="whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={this.handleReset}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors text-sm font-medium"
                  >
                    Reload Page
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-600">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If this problem persists, please try:
              </p>
              <ul className="mt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Checking your internet connection</li>
                <li>Using a different browser</li>
                <li>Clearing your browser cache</li>
                <li>Contacting support if the issue continues</li>
              </ul>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default PanoramaErrorBoundary
