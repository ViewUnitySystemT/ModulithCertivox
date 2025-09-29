import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Download, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Lock
} from 'lucide-react';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  ipAddress: string;
  sessionId: string;
}

export default function AuditUI() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'warning' | 'error'>('all');
  const [dateRange, setDateRange] = useState('today');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Mock audit data
  useEffect(() => {
    const mockData: AuditEntry[] = [
      {
        id: '1',
        timestamp: '2025-01-18 14:30:25',
        user: 'admin@rf-system.com',
        action: 'RF_SCAN',
        resource: '433.92 MHz',
        status: 'success',
        details: 'Frequency scan completed successfully',
        ipAddress: '192.168.1.100',
        sessionId: 'sess_abc123'
      },
      {
        id: '2',
        timestamp: '2025-01-18 14:28:15',
        user: 'operator@rf-system.com',
        action: 'FREQUENCY_TUNE',
        resource: '868.35 MHz',
        status: 'warning',
        details: 'Frequency tuning completed with minor interference detected',
        ipAddress: '192.168.1.101',
        sessionId: 'sess_def456'
      },
      {
        id: '3',
        timestamp: '2025-01-18 14:25:42',
        user: 'admin@rf-system.com',
        action: 'SYSTEM_CONFIG',
        resource: 'RF_Transceiver_01',
        status: 'error',
        details: 'Configuration update failed - hardware not responding',
        ipAddress: '192.168.1.100',
        sessionId: 'sess_ghi789'
      },
      {
        id: '4',
        timestamp: '2025-01-18 14:20:18',
        user: 'operator@rf-system.com',
        action: 'SIGNAL_ANALYSIS',
        resource: '2.4 GHz Band',
        status: 'success',
        details: 'Signal analysis completed - no anomalies detected',
        ipAddress: '192.168.1.101',
        sessionId: 'sess_jkl012'
      }
    ];
    setAuditEntries(mockData);
    setFilteredEntries(mockData);
  }, []);

  // Filter entries
  useEffect(() => {
    let filtered = auditEntries;

    if (searchTerm) {
      filtered = filtered.filter(entry => 
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.resource.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    setFilteredEntries(filtered);
  }, [searchTerm, statusFilter, auditEntries]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    // Simulate export
    setTimeout(() => {
      setIsExporting(false);
      alert('Audit log exported successfully!');
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Audit Dashboard
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete RF system audit trail and compliance monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Exporting...' : 'Export Audit'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span>{filteredEntries.length} entries</span>
          </div>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Entries List */}
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(entry.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {entry.action}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(entry.status)}`}>
                            {entry.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {entry.resource}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {entry.user}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Entry Details */}
          {selectedEntry && (
            <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Entry Details
                </h3>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Action
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                    {selectedEntry.action}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Resource
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                    {selectedEntry.resource}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Details
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                    {selectedEntry.details}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      User
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                      {selectedEntry.user}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IP Address
                    </label>
                    <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                      {selectedEntry.ipAddress}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border font-mono">
                    {selectedEntry.sessionId}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timestamp
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 p-2 rounded border">
                    {selectedEntry.timestamp}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
