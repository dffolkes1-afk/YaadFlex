import { Link } from 'wouter';
import { Settings, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardButton() {
  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href="/ceo-dashboard">
        <a className="
          flex items-center gap-2 px-4 py-3
          bg-gradient-to-r from-purple-600 to-pink-600
          text-white font-bold rounded-full shadow-2xl
          hover:from-purple-700 hover:to-pink-700
          transition-all duration-200
        ">
          <LayoutDashboard className="h-5 w-5" />
          <span>MY DASHBOARD</span>
        </a>
      </Link>
    </motion.div>
  );
}