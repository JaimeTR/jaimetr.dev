import Link from 'next/link'
import React from 'react'

export const Pill = ({ children, url, externalUrl = false, ariaLabel }) => {
    if (!externalUrl) {
        return (
            <Link
                href={url}
                aria-label={ariaLabel}
                className="rounded-full text-dark-800 dark:text-dark-200 border border-gray-300/60 dark:border-white/20 shadow-sm hover:shadow-md flex justify-center items-center gap-x-2 py-1 px-2 md:py-2 text-xs md:text-base md:px-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 hover:scale-105 transition-all"
            >
                <span aria-hidden="true" className="contents">{children}</span>
            </Link>
        )
    }
    return (
        <a
            href={url}
            aria-label={ariaLabel}
            className="rounded-full text-dark-800 dark:text-dark-200 border border-gray-300/60 dark:border-white/20 shadow-sm hover:shadow-md flex justify-center items-center gap-x-2 py-1 px-2 md:py-2 text-xs md:text-base md:px-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-950 hover:scale-105 transition-all"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span aria-hidden="true" className="contents">{children}</span>
        </a>
    )
}
