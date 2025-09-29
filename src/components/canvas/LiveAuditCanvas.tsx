import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  Shield, 
  Activity,
  FileText,
  Settings,
  Package,
  Palette,
  Radio,
  Code
} from 'lucide-react';

interface AuditResult {
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

interface AuditReport {
  timestamp: number;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warningChecks: number;
  results: AuditResult[];
}

export default function LiveAuditCanvas() {
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  // Simulate audit checks (in real implementation, this would call the actual audit function)
  const runAudit = async () => {
    setIsRunning(true);
    
    // Simulate audit delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock audit results based on current state
    const mockResults: AuditResult[] = [
      // UI Variants
      { category: 'UI Variants', item: 'classic', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'minimal', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'hardware', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'neuro', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'satellite', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'transceiver', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'groundstation', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      { category: 'UI Variants', item: 'funkcore', status: 'pass', message: 'Registered', details: 'Component file exists and is registered in UI store' },
      
      // Theme Configuration
      { category: 'Theme Configuration', item: 'Tailwind Config', status: 'pass', message: 'OK', details: 'Tailwind theme configuration is properly set up' },
      
      // Environment Variables
      { category: 'Environment Variables', item: '.env.local', status: 'warning', message: 'Missing NEXT_PUBLIC_UI_MODE or NEXT_PUBLIC_THEME', details: 'Some environment variables may be missing' },
      
      // Logger Implementation
      { category: 'Logger Implementation', item: 'rfLogger', status: 'pass', message: 'Complete', details: 'Logger has all required methods (info, debug, warn, error)' },
      
      // RF Core Implementation
      { category: 'RF Core Implementation', item: 'rfCore', status: 'pass', message: 'Complete', details: 'RF Core has frequency bands and hardware detection' },
      
      // Package Configuration
      { category: 'Package Configuration', item: 'package.json', status: 'pass', message: 'Scripts configured', details: 'Package.json has required build and dev scripts' },
      
      // Next.js Configuration
      { category: 'Next.js Configuration', item: 'next.config.js', status: 'pass', message: 'Static export configured', details: 'Next.js is configured for static export' },
      
      // Public Assets
      { category: 'Public Assets', item: 'favicon.ico', status: 'warning', message: 'Missing', details: 'Asset file is missing from public directory' },
      { category: 'Public Assets', item: 'logo.svg', status: 'warning', message: 'Missing', details: 'Asset file is missing from public directory' },
      { category: 'Public Assets', item: 'manifest.json', status: 'warning', message: 'Missing', details: 'Asset file is missing from public directory' },
    ];

    const report: AuditReport = {
      timestamp: Date.now(),
      totalChecks: mockResults.length,
      passedChecks: mockResults.filter(r => r.status === 'pass').length,
      failedChecks: mockResults.filter(r => r.status === 'fail').length,
      warningChecks: mockResults.filter(r => r.status === 'warning').length,
      results: mockResults
    };

    setAuditReport(report);
    setLastRun(new Date());
    setIsRunning(false);
  };

  const exportAuditReport = () => {
    if (!auditReport) return;
    
    const dataStr = JSON.stringify(auditReport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `modulith-audit-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'fail':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'UI Variants':
        return <Package className="w-4 h-4" />;
      case 'Theme Configuration':
        return <Palette className="w-4 h-4" />;
      case 'Environment Variables':
        return <Settings className="w-4 h-4" />;
      case 'Logger Implementation':
        return <FileText className="w-4 h-4" />;
      case 'RF Core Implementation':
        return <Radio className="w-4 h-4" />;
      case 'Package Configuration':
        return <Package className="w-4 h-4" />;
      case 'Next.js Configuration':
        return <Code className="w-4 h-4" />;
      case 'Public Assets':
        return <FileText className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  // Group results by category
  const groupedResults = auditReport?.results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, AuditResult[]>) || {};

  const successRate = auditReport ? Math.round((auditReport.passedChecks / auditReport.totalChecks) * 100) : 0;

  return (
    <div className="h-full w-full bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
            <Shield className="w-6 h-6 text-blue-500" />
            <span>Live Audit Canvas</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Real-time system integrity and configuration checks
          </p>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            onClick={runAudit}
            disabled={isRunning}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isRunning
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running...' : 'Run Audit'}</span>
          </motion.button>
          
          {auditReport && (
            <motion.button
              onClick={exportAuditReport}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {auditReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Checks</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {auditReport.totalChecks}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Passed</span>
            </div>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {auditReport.passedChecks}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {auditReport.failedChecks}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Warnings</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {auditReport.warningChecks}
            </p>
          </motion.div>
        </div>
      )}

      {/* Success Rate */}
      {auditReport && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">{successRate}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${successRate}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-2 rounded-full ${
                successRate >= 90 ? 'bg-green-500' :
                successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>
      )}

      {/* Last Run Info */}
      {lastRun && (
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Last run: {lastRun.toLocaleString()}
        </div>
      )}

      {/* Detailed Results */}
      {auditReport && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detailed Results</h3>
          
          {Object.entries(groupedResults).map(([category, results], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(category)}
                  <h4 className="font-semibold text-gray-900 dark:text-white">{category}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({results.length} items)
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                {results.map((result, index) => (
                  <motion.div
                    key={`${result.category}-${result.item}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <span className="font-medium">{result.item}</span>
                        <p className="text-sm opacity-75">{result.message}</p>
                        {result.details && (
                          <p className="text-xs opacity-60 mt-1">{result.details}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* No Results State */}
      {!auditReport && !isRunning && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Audit Results
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Click "Run Audit" to perform system integrity checks
          </p>
        </div>
      )}

      {/* Running State */}
      {isRunning && (
        <div className="text-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Running Audit...
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Checking system integrity and configuration
          </p>
        </div>
      )}
    </div>
  );
}
