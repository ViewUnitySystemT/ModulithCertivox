import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Signal, 
  Shield, 
  Activity, 
  Zap, 
  Monitor, 
  Download,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';

export default function ClassicUI() {
  const { signalData, auditData } = useRFHardwareStore();
  const [selectedTab, setSelectedTab] = useState('signals');
  const [isScanning, setIsScanning] = useState(false);

  const tabs = [
    { id: 'signals', label: 'Signal Analysis', icon: Signal },
    { id: 'audit', label: 'Audit Trail', icon: Shield },
    { id: 'certificates', label: 'Certificates', icon: Monitor },
    { id: 'status', label: 'System Status', icon: Activity },
  ];

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => setIsScanning(false), 3000);
  };

  const exportAudit = () => {
    // Implementation for audit export
    console.log('Exporting audit data...');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Professional RF Analysis Suite
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Complete auditable radio frequency communication system
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsScanning(!isScanning)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isScanning
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-2" />
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </button>
            <button
              onClick={exportAudit}
              className="px-4 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-lg font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              <Download className="w-4 h-4 inline mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    selectedTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <motion.div
          key={selectedTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {selectedTab === 'signals' && (
            <div className="space-y-6">
              {/* Signal Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Signal className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                    <div className={8 h-8 text-blue-600 dark:text-blue-300" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Active Signals</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-300" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Verified Sources</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">8</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-purple-800 dark:text-purple-200">Signal Strength</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">-42 dBm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Signal Chart */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Real-time Signal Analysis
                </h3>
                <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Signal className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Signal visualization will appear here</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Audit Trail
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Signal scan initiated', timestamp: '2024-01-15 14:30:21', status: 'success' },
                    { action: 'RF module calibration', timestamp: '2024-01-15 14:29:45', status: 'success' },
                    { action: 'Hardware connection test', timestamp: '2024-01-15 14:28:12', status: 'warning' },
                    { action: 'System initialization', timestamp: '2024-01-15 14:27:33', status: 'success' },
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {entry.status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {entry.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                      {entry.status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{entry.action}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{entry.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'certificates' && (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-blue-600" />
                  Validated Certificates
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'RF Hardware Certification', issuer: 'TEL Standards Institute', valid: true },
                    { name: 'Signal Integrity Certificate', issuer: 'RF Quality Assurance', valid: true },
                    { name: 'Communication Security Cert', issuer: 'Cyber Security Labs', valid: true },
                    { name: 'Compliance Audit Report', issuer: 'Regulatory Body', valid: false },
                  ].map((cert, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${cert.valid ? 'border-green-200 bg-green-50 dark:bg-green-900 dark:border-green-700' : 'border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{cert.name}</h4>
                        {cert.valid ? <CheckCircle className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-600" />}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Issuer: {cert.issuer}</p>
                      <p className={`text-xs mt-1 ${cert.valid ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        Status: {cert.valid ? 'Valid' : 'Expired'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'status' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                    System Health
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">CPU Usage</span>
                      <span className="font-mono text-green-600">23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Memory</span>
                      <span className="font-mono text-green-600">1.2 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">RF Module</span>
                      <span className="font-mono text-green-600">Online</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Temperature</span>
                      <span className="font-mono text-orange-600">42°C</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2 text-blue-600" />
                    Configuration
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Frequency Band</span>
                      <span className="font-mono">2.4 GHz</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Channel Width</span>
                      <span className="font-mono">20 MHz</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Modulation</span>
                      <span className="font-mono">QPSK</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Power Level</span>
                      <span className="font-mono">-10 dBm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
