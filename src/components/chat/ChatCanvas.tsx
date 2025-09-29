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
        if (freqMatch) {
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
        metadata: { command: command.toLowerCase().split(' ')[0] },
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
    if (e.key === 'Enter' && !e.shiftKey让我开始为这个任务创建todos：
<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>
todo_write
