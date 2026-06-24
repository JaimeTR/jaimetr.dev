"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function ContactSection() {
  const { scrollYProgress } = useScroll();
  const scaleOnScroll = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const links = [
    { name: "LinkedIn", icon: FaLinkedin, href: "https://www.linkedin.com/in/jaimetr/", color: "hover:text-blue-500", bg: "hover:bg-blue-500/10" },
    { name: "GitHub", icon: FaGithub, href: "https://github.com/JaimeTR", color: "hover:text-white", bg: "hover:bg-white/10" },
    { name: "Email", icon: FaEnvelope, href: "mailto:jaimetr1309@gmail.com", color: "hover:text-red-500", bg: "hover:bg-red-500/10" },
    { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/51975646074", color: "hover:text-green-500", bg: "hover:bg-green-500/10" },
  ];

  return (
    <motion.div 
      style={{ scale: scaleOnScroll }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-row gap-4 px-6 py-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
    >
      {links.map((link, idx) => {
        const Icon = link.icon;
        return (
          <motion.a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 0.5 + idx * 0.1,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            whileHover={{ 
              scale: 1.25, 
              y: -10, 
              rotate: [-5, 5, -5, 0],
              transition: { duration: 0.3 } 
            }}
            whileTap={{ 
              scale: 0.8,
              y: 5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            className={`p-3 rounded-full text-gray-300 transition-colors ${link.color} ${link.bg}`}
            title={link.name}
          >
            <Icon className="w-6 h-6" />
          </motion.a>
        );
      })}
    </motion.div>
  );
}
