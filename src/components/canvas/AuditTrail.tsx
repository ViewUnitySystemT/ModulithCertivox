import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export const AuditTrail = ({ logs }: { logs: string[] }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="audit-trail bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-inner max-h-48 overflow-y-auto"
  >
    <h3 className="text-lg font-semibold mb-2 flex items-center text-gray-800 dark:text-white">
      <FileText className="w-5 h-5 mr-2 text-blue-500" /> Audit Trail
    </h3>
    <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-200">
      {logs.map((log, idx) => (
        <motion.li
          key={idx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.05 }}
          className="font-mono text-xs break-words"
        >
          {log}
        </motion.li>
      ))}
    </ul>
  </motion.div>
);