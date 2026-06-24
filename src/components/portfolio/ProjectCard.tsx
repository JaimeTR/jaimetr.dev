"use client";

import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import Image from "next/image";
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'

export interface Project {
  id: number;
  title: string;
  description: string;
  image?: string;
  image_url?: string;
  category: string;
  rubro?: string;
  technologies: string[];
  url: string;
  allowIframe?: boolean;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

interface ProjectCardProps {
  project: Project;
  onOpenProject: (url: string) => void;
  isEmbedded?: boolean;
}

export default function ProjectCard({ project, onOpenProject, isEmbedded = false }: ProjectCardProps) {
  const { language } = useLanguage()
  const t = useTranslation(language)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col justify-end overflow-hidden rounded-[32px] bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 shadow-lg hover:shadow-xl dark:shadow-[0_15px_40px_rgba(0,0,0,0.8)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:border-dark-300 dark:hover:border-dark-600 transition-all duration-500 ease-out h-[350px] sm:h-[380px] lg:h-[400px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-dark-50 dark:bg-dark-900">
        {project.image_url && project.image_url !== "" ? (
           <Image 
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-100 to-white dark:from-dark-800 dark:to-dark-950 transition-transform duration-700 ease-out group-hover:scale-105" />
        )}
      </div>

      {/* Glassmorphism Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 z-10 h-[60%] bg-gradient-to-t from-white via-white/80 dark:from-black dark:via-black/80 to-transparent pointer-events-none" />
      
      {/* Content Container */}
      <div className="relative z-20 flex flex-col p-6 w-full transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
        
        {/* Title & Category */}
        <div className="mb-3">
          <h3 className="font-heading text-3xl font-bold tracking-tight text-dark-900 dark:text-white mb-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-base text-dark-600 dark:text-dark-400">
              {project.category}
            </p>
            {project.rubro && (
              <>
                <span className="text-dark-400 dark:text-dark-600">·</span>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">{project.rubro}</span>
              </>
            )}
          </div>
        </div>

        {/* Technologies / Tags */}
        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2 text-sm text-dark-700 dark:text-dark-200 font-medium">
          {project.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-600 dark:bg-primary-400" /> {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="flex items-center gap-1 text-dark-500 dark:text-dark-400">
              +{project.technologies.length - 3} {t('mas')}
            </span>
          )}
        </div>

        {/* Action Button */}
        {!isEmbedded && (
          <button 
            onClick={() => {
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              if (project.allowIframe === false || isMobile) {
                window.open(project.url, '_blank', 'noopener,noreferrer');
              } else {
                onOpenProject(project.url);
              }
            }}
            className="w-full relative group/btn overflow-hidden rounded-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative flex items-center justify-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 border border-dark-300 dark:border-white/10 px-6 py-3.5 rounded-full text-sm font-bold tracking-widest text-dark-800 dark:text-dark-200 transition-colors w-full h-full shadow-sm dark:shadow-[0_8px_30px_rgba(255,255,255,0.1)] uppercase">
              <Globe className="w-4 h-4 text-dark-800 dark:text-dark-200" />
              <span>{t('verProyecto')}</span>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}
