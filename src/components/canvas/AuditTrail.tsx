import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Hash, Clock, Shield, Download, Search,
  CheckCircle, XCircle, AlertTriangle, Info, Activity, Zap
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: number;
  operation: string;
  details: Record<string, unknown>;
  hash: string;
  level: 'info' | 'warn' | 'error' | 'audit' | 'critical';
  category: string;
  success: boolean;
}

interface AuditTrailProps {
  logs: string[];
  maxEntries?: number;
  showFilters?: boolean;
  showExport?: boolean;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  logs,
  maxEntries = 100,
  showFilters = true,
  showExport = true,
}) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const generateSHA256Hash = useCallback(async (data: string): Promise<string> => {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }, []);

  const parseLogEntry = useCallback(async (logString: string): Promise<AuditEntry> => {
    const timestamp = Date.now();
    const operation = logString.split('] ')[1]?.split(' (Hash:')[0] || 'Unknown Operation';
    const hashMatch = logString.match(/Hash: ([a-f0-9]+)/);
    const hash = hashMatch ? hashMatch[1] : await generateSHA256Hash(logString + timestamp);
    
    let category = 'General';
    let level: AuditEntry['level'] = 'info';
    
    if (logString.includes('Frequency')) category = 'RF Control';
    else if (logString.includes('Modulation')) category = 'RF Control';
    else if (logString.includes('Power')) category = 'RF Control';
    else if (logString.includes('Hardware')) category = 'Hardware';
    else if (logString.includes('Audio')) category = 'Audio';
    else if (logString.includes('Satellite')) category = 'Satellite';
    else if (logString.includes('Certification')) category = 'Certification';
    else if (logString.includes('Error') || logString.includes('Failed')) {
      category = 'Error';
      level = 'error';
    }
    else if (logString.includes('Warning')) level = 'warn';
    else if (logString.includes('Critical')) level = 'critical';
    else if (logString.includes('Audit')) level = 'audit';
    
    return {
      id: `audit-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      operation,
      details: { originalLog: logString },
      hash: hash.substring(0, 16),
      level,
      category,
      success: !logString.includes('Failed') && !logString.includes('Error'),
    };
  }, [generateSHA256Hash]);

  useEffect(() => {
    const convertLogs = async () => {
      const entries: AuditEntry[] = [];
      
      for (const log of logs.slice(0, maxEntries)) {
        try {
          const entry = await parseLogEntry(log);
          entries.push(entry);
        } catch (error) {
          console.warn('Failed to parse log entry:', log, error);
        }
      }
      
      setAuditEntries(entries);
    };
    
    convertLogs();
  }, [logs, maxEntries, parseLogEntry]);

  useEffect(() => {
    let filtered = [...auditEntries];
    
    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.operation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (levelFilter !== 'all') {
      filtered = filtered.filter(entry => entry.level === levelFilter);
    }
    
    filtered.sort((a, b) => b.timestamp - a.timestamp);
    setFilteredEntries(filtered);
  }, [auditEntries, searchTerm, levelFilter]);

  const getLevelIcon = (level: AuditEntry['level']) => {
    switch (level) {
      case 'info': return <Info className="w-4 h-4 text-blue-500" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'audit': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'critical': return <Zap className="w-4 h-4 text-red-600" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLevelColor = (level: AuditEntry['level']) => {
    switch (level) {
      case 'info': return 'text-blue-600 dark:text-blue-400';
      case 'warn': return 'text-yellow-600 dark:text-yellow-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'audit': return 'text-purple-600 dark:text-purple-400';
      case 'critical': return 'text-red-700 dark:text-red-300';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const toggleDetails = (entryId: string) => {
    setShowDetails(prev => ({
      ...prev,
      [entryId]: !prev[entryId],
    }));
  };

  const exportAuditLog = useCallback(async () => {
    try {
      const exportData = {
        exportInfo: {
          timestamp: new Date().toISOString(),
          totalEntries: filteredEntries.length,
        },
        entries: filteredEntries,
      };
      
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `modulith-audit-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [filteredEntries]);

  return (
    <div className="audit-trail-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Audit Trail
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Activity className="w-4 h-4" />
            <span>{filteredEntries.length} entries</span>
          </div>
        </div>
        
        {showExport && (
          <motion.button
            onClick={exportAuditLog}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </motion.button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search operations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Level
              </label>
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="info">Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
                <option value="audit">Audit</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No audit entries found matching your criteria.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {getLevelIcon(entry.level)}
                    <span className={`text-sm font-semibold ${getLevelColor(entry.level)}`}>
                      {entry.level.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                      {entry.category}
                    </span>
                    {entry.success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-900 dark:text-white mb-1">
                    {entry.operation}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Hash className="w-3 h-3" />
                      <span className="font-mono">{entry.hash}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  onClick={() => toggleDetails(entry.id)}
                  className="ml-2 px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showDetails[entry.id] ? 'Hide' : 'Show'} Details
                </motion.button>
              </div>
              
              {showDetails[entry.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <div className="grid grid-cols-2 gap-2">
                      <div><strong>ID:</strong> {entry.id}</div>
                      <div><strong>Category:</strong> {entry.category}</div>
                    </div>
                    
                    <div className="mt-2">
                      <strong>Details:</strong>
                      <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-x-auto">
                        {JSON.stringify(entry.details, null, 2)}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};