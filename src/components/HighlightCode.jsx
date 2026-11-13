'use client'

import { useEffect } from 'react'
import hljs from 'highlight.js'

export default function HighlightCode() {
  useEffect(() => { hljs.highlightAll() }, [])
  return null
}
