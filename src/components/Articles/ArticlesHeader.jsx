'use client'
import Link from 'next/link'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useEffect, useState } from 'react'

export default function ArticlesHeader() {
  const [mounted, setMounted] = useState(false)
  const { language } = useLanguage()

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <>
      <h2 className=" text-3xl font-bold text-dark-700 dark:text-primary-50">
        {language === 'es' ? 'Artículos' : 'Articles'}
      </h2>
      <div className="flex justify-center w-full mt-8">
        <Link
          className="flex justify-center items-center gap-2 text-dark-800 font-bold dark:text-dark-200 relative overflow-hidden z-10   before:content-[''] before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-dark-900 dark:before:bg-dark-50 before:rounded-lg   before:-z-10 before:transition-all before:duration-500 before:hover:w-full  transition-all duration-300  hover:text-dark-900  dark:hover:text-dark-50"
          href="/posts"
        >
          {language === 'es' ? 'Más artículos' : 'More articles'} <AiOutlineArrowRight />
        </Link>
      </div>
    </>
  )
}
