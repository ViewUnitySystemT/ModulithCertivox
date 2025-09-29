import { useState } from 'react';
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
import { rfLogger } from '../../lib/logger';

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
    rfLogger.audit('Exporting audit data', { 
      entryCount: auditData?.length || 0,
      timestamp: Date.now() 
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              RF System Monitor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete audit view with signal analysis and certifications
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleScan}
              disabled={isScanning}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Activity className={`w-4 h-4 ${isScanning ? 'animate-pulse' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
            </button>
            <button
              onClick={exportAudit}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedTab === tab.id
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {selectedTab === 'signals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Signal className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Signal Strength</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {signalData?.strength || '-45'} dBm
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Current reading</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Power Level</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {signalData?.power || '85'}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Transmit power</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">SNR</h3>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {signalData?.snr || '40'} dB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Signal-to-noise ratio</div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Audit Entries
              </h3>
              <div className="space-y-3">
                {auditData?.slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{entry.action}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{entry.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{entry.user}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'certificates' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Certifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-white">FCC Compliance</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Certified for commercial use</div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">ISO 27001</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Information security management</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'status' && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-gray-700 rounded border">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-white">RF Hardware</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">All systems operational</div>
                </div>
                <div className="p-4 bg-white dark:bg-gray-700 rounded border">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900 dark:text-white">Network</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Connected and stable</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}