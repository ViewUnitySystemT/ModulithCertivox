import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Signal, 
  Settings, 
  Bell, 
  User,
  ChevronDown,
  Shield,
  Download,
  Globe,
  Zap
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';
import { useThemeStore } from '../../stores/themeStore';

export default function ProfessionalHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { connectionStatus, signalData } = useRFHardwareStore();
  const { darkMode } = useThemeStore();

  const notifications = [
    {
      id: '1',
      type: 'success',
      title: 'RF Module Connected',
      message: 'Hardware interface is now active',
      timestamp: Date.now() - 300000,
      read: false,
    },
    {
      id: '2', 
      type: 'info',
      title: 'Scan Complete',
      message: 'Signal analysis finished',
      timestamp: Date.now() - 600000,
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Temperature Alert',
      message: 'Hardware temperature is elevated',
      timestamp: Date.now() - 900000,
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className={`border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          
          {/* Logo & Title */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Signal className="w-6 h-6 text-white" />
              </div>
              {connectionStatus && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"
                />
              )}
            </div>
            
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                RF UI Portal
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                Professional RF Communication System
              </p>
            </div>
          </motion.div>

          {/* Status Panel */}
          <div className="flex items-center space-x-6">
            
            {/* Connection Status */}
            <motion.div 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-opacity-10"
              animate={{ 
                backgroundColor: connectionStatus ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderColor: connectionStatus ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
              }}
              className="border rounded-lg px-3 py-1"
            >
              <div className={`w-2 h-2 rounded-full ${connectionStatus ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                {connectionStatus ? 'Connected' : 'Offline'}
              </span>
            </motion.div>

            {/* Signal Info */}
            {connectionStatus && (
              <motion.div 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-opacity-10 bg-blue-600"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className={`text-sm font-mono ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  {signalData ? `${signalData.power.toFixed(1)} dBm` : '-45 dBm'}
                </span>
              </motion.div>
            )}

            {/* Notifications */}
            <div className="relative">
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {unreadCount}
                  </motion.div>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: showNotifications ? 1 : 0,
                  y: showNotifications ? 0 : -10,
                  pointerEvents: showNotifications ? 'auto' : 'none'
                }}
                className={`absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-lg z-50 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Notifications
                    </h3>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className={`text-xs ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Mark all read
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          notification.read 
                            ? darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                            : darkMode ? 'border-blue-600 bg-blue-600/20' : 'border-blue-200 bg-blue-50'
                        }`}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success' ? 'bg-green-400' :
                            notification.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'
                          }`} />
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {notification.title}
                            </h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                              {notification.message}
                            </p>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                  RF Portal
                </span>
                <ChevronDown className="w-4 h-4" />
              </motion.button>

              {/* User Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ 
                  opacity: showUserMenu ? 1 : 0,
                  y: showUserMenu ? 0 : -10,
                  pointerEvents: showUserMenu ? 'auto' : 'none'
                }}
                className={`absolute right-0 top-full mt-2 w-64 rounded-lg border shadow-lg z-50 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        RF Portal User
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        System User
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                      <Shield className="w-4 h-4" />
                      <span className="text-sm">Security Settings</span>
                    </button>
                    
                    <button className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Export Data</span>
                    </button>
                    
                    <button className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-100 text-gray-700'
                    }`}>
                      <Globe className="w-4 h-4" />
                      <span className="text-sm">Network Status</span>
                    </button>
                    
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Settings */}
            <motion.button
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
              }`}
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Backdrop for dropdowns */}
        {(showNotifications || showUserMenu) && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowNotifications(false);
              setShowUserMenu(false);
            }}
          />
        )}
      </div>
    </header>
  );
}
