/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom RF Theme Colors
        rf: {
          primary: '#1e40af',
          secondary: '#6366f1',
          accent: '#8b5cf6',
          success: '#059669',
          warning: '#d97706',
          error: '#dc2626',
        },
        // Neural Interface Colors
        neural: {
          alpha: '#6366f1',
          beta: '#8b5cf6',
          theta: '#ec4899',
          delta: '#f59e0b',
          gamma: '#10b981',
        },
        // Hardware Colors
        hardware: {
          cpu: '#3b82f6',
          memory: '#6366f1',
          gpu: '#8b5cf6',
          storage: '#10b981',
          network: '#f59e0b',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'signal-scan': 'signalScan 2s infinite',
        'pulse-neural': 'pulseNeural 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
和 '40%, 43%': { transform: 'translateY(-10px)' },
        },
        signalScan: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        pulseNeural: {
          '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.8)' },
        },
      },
      boxShadow: {
        'rf': '0 4px 20px rgba(59, 130, 246, 0.1)',
        'neural': '0 4px 20px rgba(139, 92, 246, 0.1)',
        'hardware': '0 4px 20px rgba(16, 185, 129, 0.1)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
      },
      backgroundImage: {
        'gradient-rf': 'linear-gradient(135deg, #667eea 0%, #764ba2)',
        'gradient-neural': 'linear-gradient(135deg, #a78bfa 0%, #ec4899)',
        'gradient-hardware': 'linear-gradient(135deg, #06b6d4 0%, #10b981)',
        'pattern-signals': 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
        'pattern-neural': 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function({ addUtilities }) {
      addUtilities({
        '.text-outline': {
          '-webkit-text-stroke': '1px black',
          'text-stroke': '1px black',
        },
        '.glass': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(10px)',
          'background-color': 'rgba(0, 0, 0, 0.1)',
        },
        '.rf-grid': {
          'background-image': 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
          'background-size': '50px 50px',
        },
        '.neural-grid': {
          'background-image': 'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
          'background-size': '50px 50px',
        },
      });
    },
  ],
};
