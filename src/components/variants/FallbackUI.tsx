import React from 'react';

export default function FallbackUI() {
  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          RF UI Portal
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Professional RF Communication System Interface
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">System Status</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">All systems operational</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Connection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Ready for communication</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Frequency</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Multi-band support</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monitoring</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Real-time analysis</p>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
          >
            Refresh Interface
          </button>
        </div>
      </div>
    </div>
  );
}
