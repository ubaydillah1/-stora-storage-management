"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useUploadQueue } from "@/store/useUploadQueue";
import { Loader2 } from "lucide-react";

const UploadToast = () => {
  const items = useUploadQueue((s) => s.items);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col-reverse gap-3 z-[9999]">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white shadow-xl border rounded-xl w-[260px] p-4 flex items-center gap-3"
          >
            <Loader2 className="animate-spin text-blue-500" size={20} />

            <div className="flex flex-col min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-gray-500">Uploading...</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default UploadToast;
