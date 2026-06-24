"use client";

import { motion } from "framer-motion";

const technologies = [
  "React", "Next.js", "Node.js", "TypeScript", 
  "WordPress", "PHP", "MySQL", "PostgreSQL", 
  "Elementor", "Desarrollo de Temas", "Implementación de Plugins", "Diseño Web",
  "OpenAI", "Docker", "GitHub", "AWS"
];

export default function TechSection() {
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none" />
      
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Stack Tecnológico</h2>
          <p className="text-muted max-w-2xl mx-auto">Herramientas y tecnologías que utilizo para construir soluciones digitales de alto rendimiento.</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {technologies.map((tech, idx) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="px-6 py-4 glassmorphism rounded-2xl flex items-center justify-center border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-white/80 font-medium tracking-wide">{tech}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
