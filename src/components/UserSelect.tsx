import React, { useEffect } from 'react';
import { useVoice } from "@/context/VoiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function UserSelect() {
  const { setSelectedUser, setStep } = useVoice();
  
  useEffect(() => {
    setSelectedUser("Nicolas Lapp");
    const timer = setTimeout(() => setStep(2), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-50 to-gray-100 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="transform transition-all hover:shadow-xl border border-gray-200">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-6 sm:space-y-8 text-center">
              <motion.div 
                className="space-y-2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 to-black text-transparent bg-clip-text tracking-tight">
                  Hi, Nicolas!
                </h1>
                <motion.p 
                  className="text-base sm:text-lg text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Welcome back to your voice assistant
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg blur opacity-10"></div>
                <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
                  <p className="text-gray-700 text-base sm:text-lg">
                    Your personal AI assistant is ready to help you
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-center gap-2 py-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  className="h-1 w-8 sm:w-12 bg-gray-800 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 1, duration: 0.5 }}
                />
                <motion.div 
                  className="h-1 w-8 sm:w-12 bg-gray-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                />
                <motion.div 
                  className="h-1 w-8 sm:w-12 bg-gray-200 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                />
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}