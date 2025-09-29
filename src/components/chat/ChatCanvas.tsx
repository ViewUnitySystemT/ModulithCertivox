import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Bot, 
  User, 
  Settings,
  Download,
  Trash2,
  Zap,
  Activity,
  MessageSquare,
  Command
} from 'lucide-react';
import { useRFHardwareStore } from '../../stores/rfHardwareStore';
import { useUIStore } from '../../stores/uiStore';

interface ChatMessage {
  id: string;
  type: 'user' | 'system' | 'rf-response' | 'error';
  content: string;
  timestamp: number;
  metadata?: {
    frequency?: number;
    power?: number;
    command?: string;
  };
}

export default function ChatCanvas() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'RF UI Portal initialized. Ready for commands.',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { startScan, setFrequency, exportAuditData } = useRFHardwareStore();
  const { mode } = useUIStore();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processCommand = async (command: string) => {
    setIsProcessing(true);
    
    const lowerCommand = command.toLowerCase().trim();
    
    // Add to history
    setCommandHistory(prev => [command, ...prev.filter(cmd => cmd !== command)].slice(0, 10));
    
    // Add user message
    addMessage({
      type: 'user',
      content: command,
    });

    try {
      // Command processing
      if (lowerCommand.includes('scan') || lowerCommand.includes('start scan')) {
        await startScan();
        addMessage({
          type: 'rf-response',
          content: 'RF signal scan initiated. Monitoring frequency spectrum...',
          metadata: { command: 'scan' },
        });
      }
      
      else if (lowerCommand.includes('frequency') || lowerCommand.includes('freq')) {
        const freqMatch = command.match(/(\d+\.?\d*)\s*(?:mhz|ghz)/i);
        if (freqMatch && freqMatch[1]) {
          const freq = parseFloat(freqMatch[1]);
          const unit = command.toLowerCase().includes('ghz') ? freq * 1000 : freq;
          setFrequency(unit);
          addMessage({
            type: 'rf-response',
            content: `Frequency set to ${freqMatch[1]} ${command.toLowerCase().includes('ghz') ? 'GHz' : 'MHz'}`,
            metadata: { command: 'frequency', frequency: unit },
          });
        } else {
          addMessage({
            type: 'rf-response',
            content: 'Please specify frequency. Example: "set frequency to 2.4 GHz"',
          });
        }
      }
      
      else if (lowerCommand.includes('export') || lowerCommand.includes('download')) {
        exportAuditData();
        addMessage({
          type: 'system',
          content: 'Audit data exported successfully.',
          metadata: { command: 'export' },
        });
      }
      
      else if (lowerCommand.includes('status') || lowerCommand.includes('info')) {
        addMessage({
          type: 'system',
          content: `System Status: Active\nUI Mode: ${mode}\nRF Module: Connected\nSignal Level: -45 dBm\nTemperature: 42°C`,
          metadata: { command: 'status' },
        });
      }
      
      else if (lowerCommand.includes('help') || lowerCommand.includes('?')) {
        addMessage({
          type: 'system',
          content: `Available Commands:\n• "scan" or "start scan" - Begin RF signal scanning\n• "set frequency to X.X GHz/MHz" - Change RF frequency\n• "status" - Get system information\n• "export" - Download audit data\n• "help" - Show this message`,
          metadata: { command: 'help' },
        });
      }
      
      else {
        addMessage({
          type: 'rf-response',
          content: `Unknown command: "${command}". Type "help" for available commands.`,
          metadata: { command: 'unknown' },
        });
      }
      
    } catch (error) {
      addMessage({
        type: 'error',
        content: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metadata: { command: command?.toLowerCase().split(' ')[0] || 'unknown' },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    processCommand(inputValue);
    setInputValue('');
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(historyIndex + 1);
        setInputValue(commandHistory[historyIndex + 1] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInputValue(commandHistory[historyIndex - 1] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputValue('');
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          RF Command Interface
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-yellow-500' : 'bg-green-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isProcessing ? 'Processing...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'system'
                  ? 'bg-green-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.metadata && (
                <p className="text-xs opacity-75 mt-1">
                  Command: {message.metadata.command}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter RF command (e.g., 'scan', 'tune 433.92', 'status')"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isProcessing}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isProcessing}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Press Enter to send, Shift+Enter for new line. Use ↑/↓ for command history.
        </div>
      </div>
    </div>
  );
}
