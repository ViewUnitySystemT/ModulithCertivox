import React, { Component, ErrorInfo, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Bug, Shield, Clock, Hash, User, Activity } from 'lucide-react';
import { rfLogger } from '../../lib/logger';

/**
 * Error Boundary Audit System
 * 
 * Jeder Fehler mit Audit-Hash dokumentiert
 * Kompromisslose Fehlerverfolgung und Zertifizierung
 */

interface ErrorAuditEntry {
  id: string;
  timestamp: number;
  error: Error;
  errorInfo: ErrorInfo;
  componentStack: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  auditHash: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'render' | 'lifecycle' | 'event' | 'async' | 'unknown';
  context: Record<string, unknown>;
  resolved: boolean;
  resolution?: string;
}

interface ErrorBoundaryAuditProps {
  children: ReactNode;
  onError?: (error: ErrorAuditEntry) => void;
  fallback?: ReactNode;
  enableAuditLogging?: boolean;
  maxErrors?: number;
}

interface ErrorBoundaryAuditState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorAudit: ErrorAuditEntry | null;
}

class ErrorBoundaryAudit extends Component<ErrorBoundaryAuditProps, ErrorBoundaryAuditState> {
  private errorAuditStore: ErrorAuditEntry[] = [];
  private maxErrors: number;

  constructor(props: ErrorBoundaryAuditProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorAudit: null,
    };

    this.maxErrors = props.maxErrors || 100;
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryAuditState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorAudit = this.createErrorAudit(error, errorInfo);
    
    this.setState({
      errorInfo,
      errorAudit,
    });

    // Store error audit
    this.errorAuditStore.push(errorAudit);
    
    // Keep only recent errors
    if (this.errorAuditStore.length > this.maxErrors) {
      this.errorAuditStore = this.errorAuditStore.slice(-this.maxErrors);
    }

    // Log error audit
    if (this.props.enableAuditLogging !== false) {
      rfLogger.error('Error boundary caught error', {
        errorId: errorAudit.id,
        auditHash: errorAudit.auditHash,
        severity: errorAudit.severity,
        category: errorAudit.category,
        componentStack: errorAudit.componentStack,
        context: errorAudit.context,
      });
    }

    // Notify parent component
    this.props.onError?.(errorAudit);

    // Send to external error tracking service if configured
    this.sendToErrorTracking(errorAudit);
  }

  private createErrorAudit(error: Error, errorInfo: ErrorInfo): ErrorAuditEntry {
    const timestamp = Date.now();
    const auditHash = this.generateAuditHash(error, errorInfo, timestamp);
    
    return {
      id: `error-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      error,
      errorInfo,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      requestId: this.getRequestId(),
      auditHash,
      severity: this.determineSeverity(error),
      category: this.categorizeError(error, errorInfo),
      context: this.extractContext(error, errorInfo),
      resolved: false,
    };
  }

  private generateAuditHash(error: Error, errorInfo: ErrorInfo, timestamp: number): string {
    const hashInput = [
      error.message,
      error.stack,
      errorInfo.componentStack,
      timestamp.toString(),
      navigator.userAgent,
      window.location.href,
    ].join('|');

    // Simple hash function for audit trail
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16).substring(0, 16);
  }

  private determineSeverity(error: Error): ErrorAuditEntry['severity'] {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    // Critical errors
    if (message.includes('chunk load') || 
        message.includes('loading chunk') ||
        message.includes('network error') ||
        stack.includes('securityerror')) {
      return 'critical';
    }

    // High severity errors
    if (message.includes('cannot read property') ||
        message.includes('undefined is not a function') ||
        message.includes('cannot access before initialization')) {
      return 'high';
    }

    // Medium severity errors
    if (message.includes('warning') ||
        message.includes('deprecated') ||
        message.includes('legacy')) {
      return 'medium';
    }

    return 'low';
  }

  private categorizeError(error: Error, errorInfo: ErrorInfo): ErrorAuditEntry['category'] {
    const message = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';

    if (message.includes('render') || message.includes('jsx')) {
      return 'render';
    }

    if (message.includes('component') || message.includes('lifecycle')) {
      return 'lifecycle';
    }

    if (message.includes('event') || message.includes('handler')) {
      return 'event';
    }

    if (message.includes('async') || message.includes('promise') || message.includes('fetch')) {
      return 'async';
    }

    return 'unknown';
  }

  private extractContext(error: Error, errorInfo: ErrorInfo): Record<string, unknown> {
    return {
      errorMessage: error.message,
      errorName: error.name,
      componentStack: errorInfo.componentStack,
      stackTrace: error.stack,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      } : null,
    };
  }

  private getUserId(): string | undefined {
    // Extract user ID from context/auth if available
    return undefined; // TODO: Implement user context
  }

  private getSessionId(): string | undefined {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('rf-portal-session-id');
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('rf-portal-session-id', sessionId);
    }
    return sessionId;
  }

  private getRequestId(): string | undefined {
    // Generate request ID for tracking
    return `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToErrorTracking(errorAudit: ErrorAuditEntry) {
    // Send to external error tracking service (e.g., Sentry, DataDog)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: errorAudit.error.message,
        fatal: errorAudit.severity === 'critical',
        custom_map: {
          audit_hash: errorAudit.auditHash,
          error_id: errorAudit.id,
          severity: errorAudit.severity,
          category: errorAudit.category,
        },
      });
    }
  }

  private retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorAudit: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorAuditDisplay
          errorAudit={this.state.errorAudit!}
          onRetry={this.retry}
          fallback={this.props.fallback}
        />
      );
    }

    return this.props.children;
  }

  // Public method to get error audit history
  getErrorAuditHistory(): ErrorAuditEntry[] {
    return [...this.errorAuditStore];
  }

  // Public method to clear error history
  clearErrorHistory(): void {
    this.errorAuditStore = [];
  }
}

// Error Audit Display Component
interface ErrorAuditDisplayProps {
  errorAudit: ErrorAuditEntry;
  onRetry: () => void;
  fallback?: ReactNode;
}

function ErrorAuditDisplay({ errorAudit, onRetry, fallback }: ErrorAuditDisplayProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    // Log retry attempt
    rfLogger.audit('Error boundary retry attempted', {
      errorId: errorAudit.id,
      auditHash: errorAudit.auditHash,
      timestamp: Date.now(),
    });

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRetry();
    setIsRetrying(false);
  };

  const getSeverityColor = (severity: ErrorAuditEntry['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-blue-500 text-white';
    }
  };

  const getCategoryIcon = (category: ErrorAuditEntry['category']) => {
    switch (category) {
      case 'render': return <Activity className="w-4 h-4" />;
      case 'lifecycle': return <Clock className="w-4 h-4" />;
      case 'event': return <User className="w-4 h-4" />;
      case 'async': return <Hash className="w-4 h-4" />;
      default: return <Bug className="w-4 h-4" />;
    }
  };

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="error-boundary-audit min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Error Boundary Audit
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fehler mit Audit-Hash dokumentiert und zertifiziert
            </p>
          </div>
        </div>

        {/* Error Summary */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(errorAudit.severity)}`}>
              {errorAudit.severity.toUpperCase()}
            </span>
            <span className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300">
              {getCategoryIcon(errorAudit.category)}
              <span>{errorAudit.category}</span>
            </span>
          </div>
          
          <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {errorAudit.error.message}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Hash className="w-4 h-4" />
                <span>Hash: {errorAudit.auditHash}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(errorAudit.timestamp).toLocaleString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Error Details
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Error Name:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{errorAudit.error.name}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Component Stack:</span>
                    <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {errorAudit.componentStack}
                    </pre>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Stack Trace:</span>
                    <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {errorAudit.error.stack}
                    </pre>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Context:</span>
                    <pre className="mt-1 text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(errorAudit.context, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
          
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        </div>

        {/* Audit Trail */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-1 mb-2">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Audit Trail</span>
            </div>
            <div className="space-y-1">
              <div>Error ID: {errorAudit.id}</div>
              <div>Session ID: {errorAudit.sessionId}</div>
              <div>Request ID: {errorAudit.requestId}</div>
              <div>User Agent: {errorAudit.userAgent}</div>
              <div>URL: {errorAudit.url}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Error Audit History Component
interface ErrorAuditHistoryProps {
  errorHistory: ErrorAuditEntry[];
  onClearHistory: () => void;
}

export function ErrorAuditHistory({ errorHistory, onClearHistory }: ErrorAuditHistoryProps) {
  return (
    <div className="error-audit-history p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Error Audit History
        </h3>
        <button
          onClick={onClearHistory}
          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {errorHistory.map((error) => (
          <div key={error.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {error.error.message}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(error.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Hash: {error.auditHash} • {error.severity} • {error.category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ErrorBoundaryAudit;
