'use client'
import { useState, useEffect, useCallback } from 'react'
import { FiMessageSquare, FiCheck, FiEye, FiChevronDown, FiChevronRight, FiUser } from 'react-icons/fi'
import { FaRobot } from 'react-icons/fa'

export function ManageChatMessages() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedSessions, setExpandedSessions] = useState({})

  const fetchMessages = useCallback(async () => {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/db/chat_messages', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const json = await res.json()
    if (json.success && json.data) {
      const grouped = groupBySession(json.data)
      setSessions(grouped)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const groupBySession = (messages) => {
    const grouped = {}
    messages.forEach((msg) => {
      if (!grouped[msg.session_id]) {
        grouped[msg.session_id] = {
          session_id: msg.session_id,
          messages: [],
          latest: msg.created_at,
          language: msg.language || 'es',
          totalMessages: 0,
          unread: 0
        }
      }
      grouped[msg.session_id].messages.push(msg)
      grouped[msg.session_id].totalMessages++
      if (!msg.is_read) grouped[msg.session_id].unread++
      if (new Date(msg.created_at) > new Date(grouped[msg.session_id].latest)) {
        grouped[msg.session_id].latest = msg.created_at
      }
    })

    const sorted = Object.values(grouped).sort(
      (a, b) => new Date(b.latest) - new Date(a.latest)
    )

    sorted.forEach((session) => {
      session.messages.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      )
    })

    return sorted
  }

  const markAsRead = async (sessionId) => {
    const token = localStorage.getItem('adminToken')
    const unreadIds = sessions
      .find((s) => s.session_id === sessionId)
      ?.messages.filter((m) => !m.is_read)
      .map((m) => m.id)

    if (!unreadIds || unreadIds.length === 0) return

    try {
      for (const id of unreadIds) {
        await fetch('/api/admin/db/chat_messages', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ id, is_read: true })
        })
      }
      fetchMessages()
    } catch (e) {
      console.error('Error marking as read:', e)
    }
  }

  const toggleExpand = (sessionId) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [sessionId]: !prev[sessionId]
    }))
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="text-center py-10 text-dark-600 dark:text-dark-300">Cargando mensajes del chat...</div>
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16">
        <FiMessageSquare size={48} className="mx-auto text-dark-300 dark:text-dark-600 mb-4" />
        <p className="text-dark-600 dark:text-dark-300">No hay conversaciones del chat aún.</p>
        <p className="text-sm text-dark-400 dark:text-dark-500">Las conversaciones aparecerán aquí cuando los visitantes usen el chatbot.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-dark-900 dark:text-white">Mensajes del Chat</h2>
        <span className="text-sm text-dark-500 dark:text-dark-400">
          {sessions.length} sesion{sessions.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sessions.map((session) => {
          const isExpanded = expandedSessions[session.session_id]
          const firstUserMsg = session.messages.find((m) => m.role === 'user')

          return (
            <div
              key={session.session_id}
              className={`bg-white dark:bg-dark-900 rounded-xl border overflow-hidden transition ${
                session.unread > 0
                  ? 'border-blue-400 dark:border-blue-600 shadow-md shadow-blue-500/10'
                  : 'border-dark-200 dark:border-dark-800'
              }`}
            >
              <div
                onClick={() => toggleExpand(session.session_id)}
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-800/50 transition"
              >
                <button className="p-1 text-dark-400 dark:text-dark-500">
                  {isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-dark-900 dark:text-white truncate">
                      {firstUserMsg
                        ? firstUserMsg.content.slice(0, 60) + (firstUserMsg.content.length > 60 ? '...' : '')
                        : 'Sin mensajes de usuario'}
                    </p>
                    {session.unread > 0 && (
                      <span className="shrink-0 px-2 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full">
                        {session.unread} nuevo{session.unread !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-dark-400 dark:text-dark-500">
                    <span>{session.totalMessages} mensajes</span>
                    <span>{session.language === 'en' ? 'EN' : 'ES'}</span>
                    <span>{formatDate(session.latest)}</span>
                    <span className="font-mono text-dark-300 dark:text-dark-600 truncate">
                      {session.session_id.slice(0, 12)}...
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.unread > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        markAsRead(session.session_id)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      <FiCheck size={14} />
                      Marcar leído
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpand(session.session_id)
                    }}
                    className="p-1.5 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition"
                    title="Ver conversación"
                  >
                    <FiEye size={16} />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-dark-200 dark:border-dark-800 bg-dark-50/50 dark:bg-dark-950/50 p-4 space-y-3 max-h-96 overflow-y-auto">
                  {session.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          msg.role === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-dark-800 text-dark-800 dark:text-dark-100 border border-dark-200 dark:border-dark-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 text-xs opacity-70">
                          {msg.role === 'user' ? (
                            <FiUser size={12} />
                          ) : (
                            <FaRobot size={12} />
                          )}
                          <span>{msg.role === 'user' ? 'Usuario' : 'JaimeAI'}</span>
                          <span className="ml-auto">{formatDate(msg.created_at)}</span>
                        </div>
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
