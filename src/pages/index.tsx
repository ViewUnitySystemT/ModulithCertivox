import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from '../components/ErrorBoundary';

export default function Home() {
  const [mode, setMode] = useState('classic');

  useEffect(() => {
    // Boot diagnostics - simple version without webpack conflicts
    const log = (...args: any[]) => {
      try {
        const message = args.join(' ') + '\n';
        localStorage._bootlog = (localStorage._bootlog || '') + message;
      } catch (e) {
        // Ignore localStorage errors
      }
      console.log('[BOOT]', ...args);
    };

    log('base', document.baseURI);
    log('location', location.href);
    log('timestamp', new Date().toISOString());
    log('page loaded successfully');

    // Error handlers
    window.onerror = (message, source, line, column, error) => {
      log('onerror:', message, source + ':' + line, error?.stack || '');
    };

    window.addEventListener('unhandledrejection', (event) => {
      log('unhandled:', event.reason?.stack || event.reason || '');
    });

    // Handle redirect from 404.html
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');
      history.replaceState(null, null, redirect);
      log('redirected to:', redirect);
    }
  }, []);

  const renderUI = () => {
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
          
          <div className="mt-8 space-x-4">
            <button 
              onClick={() => setMode('classic')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'classic' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Classic UI
            </button>
            <button 
              onClick={() => setMode('minimal')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'minimal' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Minimal UI
            </button>
            <button 
              onClick={() => setMode('audit')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                mode === 'audit' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Audit System
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>RF UI Portal - Professional RF Communication Interface</title>
        <meta name="description" content="Professional RF Communication System UI Portal - All GUI/UX variants unified" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ErrorBoundary>
        <div className={`min-h-screen ${mode === 'audit' ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900'}`}>
        
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    RF UI Portal
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Professional RF Communication System
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Online</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-200px)]">
              
              {/* Left Panel - UI Canvas */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full min-h-[600px]">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      RF System Interface
                    </h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Mode: {mode}
                    </span>
                  </div>
                  <div className="h-full overflow-auto">
                    {renderUI()}
                  </div>
                </div>
              </div>

              {/* Right Panel - Controls */}
              <div className="space-y-6">
                
                {/* Quick Controls */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    Quick Controls
                  </h3>
                  <div className="space-y-2">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                      Signal Scan
                    </button>
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors">
                      Start Monitoring
                    </button>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors">
                      Frequency Analysis
                    </button>
                  </div>
                </div>

                {/* Status Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    System Status
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Connection</span>
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Signal Strength</span>
                      <span className="text-sm text-green-600 font-medium">-65 dBm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Frequency</span>
                      <span className="text-sm text-blue-600 font-medium">2.4 GHz</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </ErrorBoundary>
    </>
  );
}