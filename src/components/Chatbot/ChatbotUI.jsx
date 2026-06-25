'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSend, FiVolume2, FiVolumeX, FiLoader } from 'react-icons/fi'
import { FaRobot } from 'react-icons/fa'
import { useLanguage } from '@/app/providers/LanguageProvider'
import Markdown from 'markdown-to-jsx'

export default function ChatbotUI() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false) // Deshabilitado por defecto
  const [showVoicePrompt, setShowVoicePrompt] = useState(false)
  const [hasPromptedVoice, setHasPromptedVoice] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const { language } = useLanguage()

  const quickActions = language === 'es' ? [
    "Experiencia laboral",
    "Proyectos destacados",
    "Descargar CV",
    "Contacto"
  ] : [
    "Work experience",
    "Featured projects",
    "Download CV",
    "Contact"
  ];
  
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isOpen && !hasPromptedVoice) {
      setShowVoicePrompt(true)
    }
    if (isOpen) {
      setShowTooltip(false)
    }
  }, [isOpen, hasPromptedVoice])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen && !hasPromptedVoice) {
        setShowTooltip(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [isOpen, hasPromptedVoice])

  const handleVoiceChoice = (choice) => {
    setVoiceEnabled(choice)
    setShowVoicePrompt(false)
    setHasPromptedVoice(true)

    if (choice && messages.length > 0) {
      playAudio(messages[0].content, true);
    }
  }

  // Cargar historial inicial desde localStorage y manejar cambios de idioma
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 0) {
        const savedMessages = localStorage.getItem('jaimeai_chat_history');
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            if (parsed && parsed.length > 1) {
              const hasWelcomedBack = sessionStorage.getItem('jaimeai_welcomed_back');
              if (!hasWelcomedBack) {
                const welcomeBackMsg = language === 'es' 
                  ? '¡Qué gusto tenerte de vuelta! 👋 ¿Tienes alguna nueva consulta o en qué te puedo ayudar?' 
                  : 'Great to have you back! 👋 Do you have any new questions or how can I help you?';
                
                const lastMsg = parsed[parsed.length - 1];
                if (lastMsg.content !== welcomeBackMsg) {
                  parsed.push({
                    role: 'assistant',
                    content: welcomeBackMsg
                  });
                }
                sessionStorage.setItem('jaimeai_welcomed_back', 'true');
              }
              return parsed;
            }
          } catch (e) {
            console.error("Error parsing chat history", e);
          }
        }
      } else if (prev.length > 1) {
        return prev;
      }
      
      return [
        {
          role: 'assistant',
          content: language === 'es' 
            ? '¡Hola! 👋 Soy JaimeAI, el asistente virtual de Jaime. ¿En qué te puedo ayudar hoy? ¿Buscas ver proyectos o agendar una cita?' 
            : 'Hello! 👋 I am JaimeAI, Jaime\'s virtual assistant. How can I help you today? Looking to see projects or schedule a meeting?'
        }
      ];
    });
  }, [language])

  // Guardar historial en localStorage cada vez que cambie
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jaimeai_chat_history', JSON.stringify(messages));
    }
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [messages, isTyping, isOpen])

  const playAudio = async (text, forcePlay = false) => {
    if (!voiceEnabled && !forcePlay) return;
    
    // Eliminar emojis del texto para que no sean leídos por TTS
    const textWithoutEmojis = text.replace(/[\p{Emoji_Presentation}\p{Emoji}\uFE0F]/gu, '');
    
    try {
      setIsSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textWithoutEmojis })
      });

      if (!res.ok) {
        const textErr = await res.text();
        console.error("TTS Backend Status:", res.status);
        console.error("TTS Backend Raw Error:", textErr);
        throw new Error('TTS Failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(url);
        };
      }
    } catch (error) {
      console.error('Audio Error:', error);
      setIsSpeaking(false);
    }
  };

  const handleSend = async (e, customText = null) => {
    e?.preventDefault()
    const textToSend = customText !== null ? customText : input
    if (!textToSend.trim()) return

    const userMessage = { role: 'user', content: textToSend.trim() }
    setMessages(prev => [...prev, userMessage])
    if (customText === null) {
      setInput('')
    }
    setIsTyping(true)

    try {
      // Preparamos el historial para enviar (limitado a los últimos 6 mensajes para contexto)
      const chatHistory = [...messages, userMessage].slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: chatHistory,
          language 
        })
      })

      const data = await response.json()

      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
        // Reproducir el audio
        playAudio(data.reply)
      } else {
        throw new Error(data.error || 'Error en la respuesta');
      }
    } catch (error) {
      console.error(error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: language === 'es' ? 'Lo siento, tuve un problema al procesar tu solicitud.' : 'Sorry, I had a problem processing your request.' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Elemento de Audio Oculto */}
      <audio ref={audioRef} className="hidden" />

      {/* Ventana de Tooltip flotante */}
      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="fixed bottom-[1.875rem] right-[5.5rem] z-40 bg-dark-900/70 dark:bg-dark-900/80 backdrop-blur-md border border-white/10 text-white pl-4 pr-2 py-2 rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer hover:bg-dark-900/90 transition-colors"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-sm font-medium whitespace-nowrap">
                {language === 'es' ? '👋 ¿Necesitas ayuda?' : '👋 Need help?'}
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              className="p-1 hover:bg-white/20 rounded-full transition-colors ml-1 text-white/70 hover:text-white"
            >
              <FiX size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-[0_0_15px_rgba(2,132,199,0.5)] bg-dark-900/70 dark:bg-dark-900/80 backdrop-blur-md border border-primary-500/30 text-white flex items-center justify-center group ${isOpen ? 'pointer-events-none' : ''}`}
      >
        <span className="absolute inset-0 rounded-full bg-primary-600/50 dark:bg-primary-500/40 animate-ping -z-10"></span>
        <FaRobot size={24} className="relative z-10" />
      </motion.button>

      {/* Ventana de Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh] bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="font-bold text-lg">IA</span>
                  </div>
                  {isSpeaking && (
                    <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">JaimeAI</h3>
                  <p className="text-xs text-white/80">{isSpeaking ? (language === 'es' ? 'Hablando...' : 'Speaking...') : (language === 'es' ? 'En línea' : 'Online')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={voiceEnabled ? "Desactivar voz" : "Activar voz"}
                >
                  {voiceEnabled ? <FiVolume2 size={18} /> : <FiVolumeX size={18} className="text-white/50" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area & Overlay */}
            <div className="flex-1 relative overflow-y-auto p-4 space-y-4 bg-dark-50/50 dark:bg-dark-950/50 scroll-smooth">
              
              <AnimatePresence>
                {showVoicePrompt && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm"
                  >
                    <div className="bg-white dark:bg-dark-800 p-5 rounded-2xl shadow-xl border border-dark-200 dark:border-dark-700 max-w-[280px] text-center">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FiVolume2 size={24} />
                      </div>
                      <h4 className="font-bold text-dark-900 dark:text-white mb-2">
                        {language === 'es' ? '¿Activar voz?' : 'Enable voice?'}
                      </h4>
                      <p className="text-sm text-dark-600 dark:text-dark-400 mb-4">
                        {language === 'es' 
                          ? '¿Quieres escuchar mi voz mientras chateas conmigo?' 
                          : 'Do you want to hear my voice while chatting with me?'}
                      </p>
                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => handleVoiceChoice(false)}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-200 hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors"
                        >
                          {language === 'es' ? 'No, gracias' : 'No thanks'}
                        </button>
                        <button 
                          onClick={() => handleVoiceChoice(true)}
                          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                        >
                          {language === 'es' ? 'Sí, activar' : 'Yes, enable'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary-600 text-white rounded-tr-sm' 
                        : 'bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-100 dark:border-dark-700 rounded-tl-sm'
                    }`}
                  >
                    <Markdown 
                      options={{
                        overrides: {
                          a: {
                            props: {
                              className: 'underline font-semibold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300',
                              target: msg.content.includes('http') ? '_blank' : '_self'
                            }
                          }
                        }
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-dark-800 border border-dark-100 dark:border-dark-700 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-dark-400 dark:bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-dark-400 dark:bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-dark-400 dark:bg-dark-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-700">
              {/* Quick Actions */}
              {messages.length < 6 && !isTyping && (
                <div className="px-3 pt-3 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSend(null, action)}
                      className="shrink-0 px-3 py-1.5 text-xs font-medium text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700/50 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 hover:border-primary-300 dark:hover:border-primary-600 transition-colors shadow-sm"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
              <div className="relative flex items-center p-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === 'es' ? "Escribe un mensaje..." : "Type a message..."}
                  className="w-full bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white rounded-full pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 border border-transparent dark:border-dark-700 text-sm transition-all"
                  disabled={isTyping}
                />
                <button 
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:hover:bg-primary-600"
                >
                  {isTyping ? <FiLoader className="animate-spin" size={16} /> : <FiSend size={16} />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
