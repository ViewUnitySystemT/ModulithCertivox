import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Canvas from '../components/canvas/Canvas';
import ChatCanvas from '../components/chat/ChatCanvas';
import UISwitcher from '../components/settings/UISwitcher';
import StatusBar from '../components/ui/StatusBar';
import ProfessionalHeader from '../components/ui/ProfessionalHeader';
import { useUIStore } from '../stores/uiStore';
import { useRFHardwareStore } from '../stores/rfHardwareStore';
import { useThemeStore } from '../stores/themeStore';

export default function Home() {
  const { mode } = useUIStore();
  const { connectionStatus } = useRFHardwareStore();
  const { currentTheme } = useThemeStore();
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  if (!pageLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h2 className="text-xl text-white">RF UI Portal</h2>
          <p className="text-gray-300">Loading Professional Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>RF UI Portal - Professional RF Communication Interface</title>
        <meta name="description" content="Professional RF Communication System UI Portal - All GUI/UX variants unified" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={`min-h-screen transition-colors duration-500 ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {/* Professional Header */}
        <ProfessionalHeader />
        
        {/* Status Bar */}
        <StatusBar 
          connectionStatus={connectionStatus}
          currentMode={mode}
          currentTheme={currentTheme}
        />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
            
            {/* Left Panel - UI Canvas */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    RF System Interface
                  </h2>
                  <UISwitcher />
                </div>
                <div className="h-full overflow-auto">
                  <Canvas />
                </div>
              </div>
            </div>
            
            {/* Right Panel - Chat & Controls */}
            <div className="space-y-6">
              
              {/* Chat Canvas */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <ChatCanvas />
              </div>
              
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
                    Export Audit
                  </button>
                </div>
              </div>
              
              {/* Hardware Status */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                  Hardware Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">RF Module:</span>
                    <span className={`px-2 py-1 rounded ${connectionStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {connectionStatus ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Signal Level:</span>
                    <span className="text-blue-600 font-mono">-45 dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Frequency:</span>
                    <span className="text-blue-600 font-mono">2.4 GHz</span>
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
              background: currentTheme === 'dark' ? '#1f2937' : '#ffffff',
              color: currentTheme === 'dark' ? '#ffffff' : '#1f2937',
            },
          }}
        />
      </div>
    </>
  );
}
