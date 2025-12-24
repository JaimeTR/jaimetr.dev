#!/usr/bin/env node
// Script CLI para generar un post MDX con IA y guardarlo en src/posts

import { generateBlogMdx, writePost } from '../src/services/ai.mjs'
import { generateCover } from '../src/services/cover.mjs'

async function main() {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Uso: npm run generate:blog -- "Tema del artículo"')
    process.exit(1)
  }

  // Parseo simple de bandera --provider <gemini|openai>
  let provider = process.env.AI_PROVIDER || 'gemini'
  const topicParts = []
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--') {
      continue
    } else if (args[i] === '--provider' && i + 1 < args.length) {
      provider = args[i + 1]
      i++
    } else {
      topicParts.push(args[i])
    }
  }
  const topic = topicParts.join(' ').trim()
  console.log('Generando artículo para tema:', topic)
  console.log('Proveedor IA:', provider)

  const { slug, mdx, title, tags } = await generateBlogMdx({ topic, provider })
  const file = writePost({ slug, mdx })
  const coverPath = await generateCover({ slug, title, tags })
  console.log('Portada generada en:', coverPath)
  console.log('Artículo generado en:', file)
}

main().catch((e) => {
  console.error('Error generando artículo:', e)
  process.exit(1)
})
