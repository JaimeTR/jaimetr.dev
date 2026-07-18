"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectViewerProps {
  url: string;
  onClose: () => void;
}

export default function ProjectViewer({ url, onClose }: ProjectViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setHasError(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [url, isLoading]);

  // Bloquear el scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Browser Window */}
        <motion.div 
          className="relative w-[95vw] md:w-full md:rounded-2xl overflow-hidden bg-zinc-900 border border-white/20 shadow-2xl flex flex-col max-w-[95vw] md:max-w-6xl aspect-[3/4] sm:aspect-square md:aspect-video max-h-[85vh]"
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Modern Top Bar (Windows Style) */}
          <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 backdrop-blur-md border-b border-white/10 shrink-0">
            
            {/* Left: URL Bar */}
            <div className="flex-1 max-w-md flex items-center bg-white/5 rounded-xl px-4 py-2 border border-white/10 text-xs text-gray-400 font-mono overflow-hidden">
              <span className="truncate w-full">{url}</span>
            </div>

            {/* Right: Actions & Close */}
            <div className="flex items-center gap-3 ml-4">
              {isLoading && (
                <RefreshCw className="w-4 h-4 text-accent animate-spin" />
              )}
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-colors"
                title="Abrir en nueva pestaña"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              
              <div className="w-px h-5 bg-white/20 mx-1 hidden sm:block" />

              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-red-500/80 p-2 rounded-xl transition-colors group"
                title="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Iframe Content */}
          <div className="flex-1 relative bg-white overflow-hidden">
            {hasError ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-dark-600 dark:text-dark-400 p-8">
                <p className="text-lg font-semibold">No se pudo cargar la vista previa</p>
                <p className="text-sm text-center">El sitio web bloquea la previsualización en iframe por seguridad.</p>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Abrir en nueva pestaña
                </a>
              </div>
            ) : (
              <iframe 
                src={url}
                className="absolute top-0 left-0 w-[calc(100%+20px)] h-full border-none"
                title="Project Preview"
                onLoad={() => setIsLoading(false)}
                onError={() => { setIsLoading(false); setHasError(true); }}
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
