import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Eye, EyeOff, Clock, Hash } from 'lucide-react';

/**
 * AuditTrail.tsx - Auditierbare Loganzeige
 * 
 * Canvas-Only, ohne Build, auditierbar
 * Vollständige Nachverfolgung aller Aktionen
 */

interface AuditLog {
  id: string;
  timestamp: number;
  message: string;
  type: 'info' | 'warning' | 'error' | 'audit' | 'command';
  hash?: string;
  metadata?: Record<string, unknown>;
}

interface AuditTrailProps {
  logs: string[];
  maxLogs?: number;
  showDetails?: boolean;
  onExport?: (logs: AuditLog[]) => void;
}

export function AuditTrail({ 
  logs, 
  maxLogs = 100, 
  showDetails = false,
  onExport 
}: AuditTrailProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('');
  const [showMetadata, setShowMetadata] = useState(showDetails);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Convert string logs to AuditLog objects
  const auditLogs: AuditLog[] = logs.map((log, index) => {
    const timestamp = Date.now() - (logs.length - index) * 1000; // Simulate timestamps
    const hash = generateHash(log + timestamp);
    
    return {
      id: `log-${timestamp}-${index}`,
      timestamp,
      message: log,
      type: getLogType(log),
      hash,
      metadata: {
        index,
        length: log.length,
        timestamp: new Date(timestamp).toISOString(),
      }
    };
  });

  // Generate hash for audit trail
  const generateHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16).substring(0, 16);
  };

  // Determine log type based on content
  const getLogType = (message: string): AuditLog['type'] => {
    if (message.includes('❌') || message.includes('Error') || message.includes('Failed')) {
      return 'error';
    }
    if (message.includes('⚠️') || message.includes('Warning')) {
      return 'warning';
    }
    if (message.includes('✅') || message.includes('Command') || message.includes('sent')) {
      return 'command';
    }
    if (message.includes('Hardware') || message.includes('detected') || message.includes('switched')) {
      return 'audit';
    }
    return 'info';
  };

  // Filter logs based on search
  const filteredLogs = auditLogs.filter(log => 
    log.message.toLowerCase().includes(filter.toLowerCase())
  );

  // Auto-scroll to bottom
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Toggle log expansion
  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  // Export logs
  const handleExport = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: auditLogs.length,
      logs: auditLogs,
      summary: {
        info: auditLogs.filter(l => l.type === 'info').length,
        warning: auditLogs.filter(l => l.type === 'warning').length,
        error: auditLogs.filter(l => l.type === 'error').length,
        audit: auditLogs.filter(l => l.type === 'audit').length,
        command: auditLogs.filter(l => l.type === 'command').length,
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    onExport?.(auditLogs);
  };

  // Clear logs
  const handleClear = () => {
    // This would typically be handled by parent component
    console.log('Clear logs requested');
  };

  // Get log type color
  const getLogTypeColor = (type: AuditLog['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-900/20';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20';
      case 'command': return 'text-blue-400 bg-blue-900/20';
      case 'audit': return 'text-green-400 bg-green-900/20';
      case 'info': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  // Get log type icon
  const getLogTypeIcon = (type: AuditLog['type']) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'command': return '⚡';
      case 'audit': return '🔍';
      case 'info': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="audit-trail-container bg-gray-800 rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Hash className="w-5 h-5 text-blue-400" />
          <span>Audit Trail</span>
          <span className="text-sm text-gray-400">({auditLogs.length} entries)</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className="p-2 text-gray-400 hover:text-white"
            title={showMetadata ? 'Hide metadata' : 'Show metadata'}
          >
            {showMetadata ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          
          <button
            onClick={handleExport}
            className="p-2 text-gray-400 hover:text-white"
            title="Export audit trail"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleClear}
            className="p-2 text-gray-400 hover:text-white"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search logs..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Log Summary */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {(['info', 'warning', 'error', 'audit', 'command'] as const).map(type => {
          const count = auditLogs.filter(l => l.type === type).length;
          return (
            <div key={type} className={`p-2 rounded text-center ${getLogTypeColor(type)}`}>
              <div className="text-sm font-semibold">{count}</div>
              <div className="text-xs capitalize">{type}</div>
            </div>
          );
        })}
      </div>

      {/* Logs List */}
      <div className="max-h-64 overflow-y-auto space-y-2">
        <AnimatePresence>
          {filteredLogs.slice(-maxLogs).map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-3 rounded-lg border-l-4 ${getLogTypeColor(log.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{getLogTypeIcon(log.type)}</span>
                    <span className="text-sm font-mono text-gray-300">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      #{log.hash}
                    </span>
                  </div>
                  
                  <div className="text-white text-sm">
                    {log.message}
                  </div>
                  
                  {showMetadata && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 text-xs text-gray-400"
                    >
                      <div>Type: {log.type}</div>
                      <div>Hash: {log.hash}</div>
                      <div>Timestamp: {new Date(log.timestamp).toISOString()}</div>
                      {log.metadata && (
                        <div>Metadata: {JSON.stringify(log.metadata, null, 2)}</div>
                      )}
                    </motion.div>
                  )}
                </div>
                
                <button
                  onClick={() => toggleLogExpansion(log.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-white"
                >
                  {expandedLogs.has(log.id) ? '−' : '+'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        <div ref={logsEndRef} />
      </div>

      {/* Footer */}
      <div className="mt-4 pt-2 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex justify-between items-center">
          <div>Last updated: {new Date().toLocaleTimeString()}</div>
          <div>Showing {filteredLogs.length} of {auditLogs.length} logs</div>
        </div>
      </div>
    </div>
  );
}
