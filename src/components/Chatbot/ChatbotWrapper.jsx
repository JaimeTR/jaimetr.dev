'use client'

import dynamic from 'next/dynamic'

const ChatbotUI = dynamic(() => import('@/components/Chatbot/ChatbotUI'), { ssr: false })

export default function ChatbotWrapper() {
  return <ChatbotUI />
}
