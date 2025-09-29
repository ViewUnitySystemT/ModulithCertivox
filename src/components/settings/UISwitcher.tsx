import { motion } from 'framer-motion';
import { 
  Monitor, 
  Minimize2, 
  Settings2, 
  Brain,
  Globe,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';
import { useThemeStore } from '../../stores/themeStore';

const uiVariants = [
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Full audit view with complete RF analysis',
    icon: Monitor,
    color: 'blue',
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Essential controls for embedded systems',
    icon: Minimize2,
    color: 'green',
  },
  {
    id: 'hardware' as const,
    name: 'Hardware',
    description: 'Real-time hardware monitoring and control',
    icon: Settings2,
    color: 'purple',
  },
  {
    id: 'neuro' as const,
    name: 'Neuro',
    description: 'EEG/EMG and Brain-Computer Interface',
    icon: Brain,
    color: 'orange',
  },
  {
    id: 'satellite' as const,
    name: 'Satellite',
    description: 'Global satellite communication interface',
    icon: Globe,
    color: 'cyan',
  },
];

export default function UISwitcher() {
  const { mode, setMode } = useUIStore();
  const { currentTheme, darkMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const currentVariant = uiVariants.find(v => v.id === mode);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colorMap[color as keyof typeof colorMap] || 'from-gray-500 to-gray-600';
  };

  const getBorderColor = (color: string, isSelected: boolean) => {
    if (!isSelected) return darkMode ? 'border-gray-600' : 'border-gray-300';
    
    const colorMap = {
      blue: 'border-blue-500',
      green: 'border-green-500', 
      purple: 'border-purple-500',
      orange: 'border-orange-500',
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-500';
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-4 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getBorderColor(currentVariant?.color || 'gray', true)} ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {currentVariant && (
          <div className={`p-1 rounded bg-gradient-to-r ${getColorClasses(currentVariant.color)}`}>
            <currentVariant.icon className="w-4 h-4 text-white" />
          </div>
        )}
        
        <div className="text-left">
          <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {currentVariant?.name || 'Unknown'}
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            {currentVariant?.description || ''}
          </div>
        </div>
        
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full left-0 mt-2 w-80 rounded-lg border shadow-lg z-50 ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-1">
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Select UI Interface
                </h3>
              </div>
              
              {/* UI Variants */}
              <div className="space-y-1">
                {uiVariants.map((variant) => {
                  const Icon = variant.icon;

                  return (
                    <motion.button
                      key={variant.id}
                      onClick={() => {
                        setMode(variant.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        mode === variant.id
                          ? `${getBorderColor(variant.color, true)} bg-opacity-10`
                          : `${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${getBorderColor(variant.color, false)}`
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-1 rounded bg-gradient-to-r ${getColorClasses(variant.color)}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {variant.name}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          {variant.description}
                        </div>
                      </div>
                      
                      {mode === variant.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-2 h-2 rounded-full bg-${variant.color}-500`}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Divider */}
              <div className={`my-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

              {/* Reset Option */}
              <motion.button
                onClick={() => {
                  setMode('classic');
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  darkMode ? 'hover:bg-gray-700 text-gray-300 hover:text-white' : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw className="w-4 h-4" />
                <div className="text-sm">Reset to Defaults</div>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
