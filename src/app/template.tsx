"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-[calc(100vh-4rem)] flex flex-col"
    >
      {children}
    </motion.div>
  );
}
