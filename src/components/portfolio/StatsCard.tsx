"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import Image from "next/image";
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import CodeIcon from '@/components/icons/Code'
import { supabase } from '@/lib/supabase'

interface StatsCardProps {
  isEmbedded?: boolean;
}

export default function StatsCard({ isEmbedded = false }: StatsCardProps = {}) {
  const { language } = useLanguage()
  const t = useTranslation(language)
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [targetValue, setTargetValue] = useState(360);
  
  // New dynamic fields
  const [bgImage, setBgImage] = useState('/developer.gif');
  const [titleEs, setTitleEs] = useState('PROYECTOS');
  const [titleEn, setTitleEn] = useState('PROJECTS');
  const [descEs, setDescEs] = useState('Experiencia continua y evolución técnica constante en cada línea de código.');
  const [descEn, setDescEn] = useState('Continuous experience and constant technical evolution in every line of code.');
  const [btnTextEs, setBtnTextEs] = useState('Ver todos los proyectos');
  const [btnTextEn, setBtnTextEn] = useState('View all projects');
  const [btnLinkEs, setBtnLinkEs] = useState('/proyectos');
  const [btnLinkEn, setBtnLinkEn] = useState('/projects');

  const count = useMotionValue(120);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase.from('profile').select('stats_projects_completed, stats_card_bg_image, stats_card_title_es, stats_card_title_en, stats_card_desc_es, stats_card_desc_en, stats_card_btn_text_es, stats_card_btn_text_en, stats_card_btn_link_es, stats_card_btn_link_en').single();
      if (!error && data) {
        if (data.stats_projects_completed) setTargetValue(data.stats_projects_completed);
        if (data.stats_card_bg_image) setBgImage(data.stats_card_bg_image);
        if (data.stats_card_title_es) setTitleEs(data.stats_card_title_es);
        if (data.stats_card_title_en) setTitleEn(data.stats_card_title_en);
        if (data.stats_card_desc_es) setDescEs(data.stats_card_desc_es);
        if (data.stats_card_desc_en) setDescEn(data.stats_card_desc_en);
        if (data.stats_card_btn_text_es) setBtnTextEs(data.stats_card_btn_text_es);
        if (data.stats_card_btn_text_en) setBtnTextEn(data.stats_card_btn_text_en);
        if (data.stats_card_btn_link_es) setBtnLinkEs(data.stats_card_btn_link_es);
        if (data.stats_card_btn_link_en) setBtnLinkEn(data.stats_card_btn_link_en);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    if (isInView) {
      // Subida lineal constante hasta el valor objetivo
      const controls = animate(count, targetValue, { duration: 12, ease: "linear" });
      return controls.stop;
    }
  }, [isInView, count, targetValue]);

  const cardClasses = `group flex flex-col h-full min-h-[400px] w-full rounded-[2.5rem] bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 overflow-hidden relative transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.1)] ${isEmbedded ? 'cursor-pointer hover:shadow-xl dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.9)] hover:-translate-y-2' : 'cursor-default'}`;

  const innerContent = (
    <>
      {/* Background GIF / Image */}
      <Image 
        src={bgImage} 
        alt="Developer Background" 
        fill
        className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-60 group-hover:opacity-20 dark:group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 dark:mix-blend-screen mix-blend-multiply"
        unoptimized={bgImage.endsWith('.gif')}
      />
      {/* Dark/Light Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-white/70 group-hover:bg-white/50 dark:bg-black/50 dark:group-hover:bg-black/40 transition-colors duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-white/50 dark:from-black/80 dark:via-transparent dark:to-black/30" />
      
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
        <h3 className="font-heading text-6xl sm:text-7xl font-bold tracking-tight mb-2 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 dark:from-white dark:via-gray-100 dark:to-gray-400">
          +<motion.span>{rounded}</motion.span>
        </h3>
        <h4 className="font-heading text-2xl font-bold tracking-widest uppercase text-dark-900 dark:text-white mb-4 drop-shadow-sm dark:drop-shadow-md">
          {language === 'en' ? titleEn : titleEs}
        </h4>
        <p className={`text-dark-600 dark:text-gray-300 text-sm sm:text-base max-w-[300px] leading-relaxed font-medium drop-shadow-sm dark:drop-shadow-md ${isEmbedded ? 'mb-12' : ''}`}>
          {language === 'en' ? descEn : descEs}
        </p>

        {isEmbedded && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center z-20">
            <div className="rounded-full text-dark-800 dark:text-dark-200 border border-gray-300/60 dark:border-white/20 shadow-sm hover:shadow-md flex justify-center items-center gap-x-2 py-3 px-8 md:py-3.5 text-sm md:text-base md:px-10 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 hover:scale-105 transition-all font-bold uppercase tracking-wide">
              <span>{language === 'en' ? btnTextEn : btnTextEs}</span>
              <CodeIcon className="w-5 h-5 transition-transform" />
            </div>
          </div>
        )}
      </div>
    </>
  );

  const MotionDiv = motion.div;

  if (isEmbedded) {
    const currentLink = language === 'en' ? btnLinkEn : btnLinkEs;
    const finalUrl = currentLink.startsWith('http') 
      ? currentLink 
      : `/${language}${currentLink.startsWith('/') ? currentLink : '/' + currentLink}`;

    return (
      <Link href={finalUrl} className="block h-full outline-none">
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className={cardClasses}
        >
          {innerContent}
        </MotionDiv>
      </Link>
    );
  }

  return (
    <MotionDiv
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className={cardClasses}
    >
      {innerContent}
    </MotionDiv>
  );
}
