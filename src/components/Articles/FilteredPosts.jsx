'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ArticleCard } from '../ArticleCard'
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronDown, FiFilter, FiX } from 'react-icons/fi'
import { useLanguage } from '@/app/providers/LanguageProvider'
import { useTranslation } from '@/helpers/translations'

// Recommended tags suggested
const RECOMMENDED_TAGS = ['React', 'Next.js', 'JavaScript', 'TypeScript', 'OpenAI', 'SEO', 'Tailwind', 'PHP', 'Laravel']

export const FilteredPosts = ({ posts, basePath = '/posts' }) => {
    const { language } = useLanguage()
    const t = useTranslation(language)
    const [search, setSearch] = useState('')
    const [selectedTags, setSelectedTags] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const resultsRef = useRef(null)

    const postsPerPage = 12

    const goToPage = (page) => {
        setCurrentPage(Math.min(Math.max(1, page), totalPages))
        // Pagination used to swap the grid without moving the viewport, so a
        // click on "next" appeared to do nothing unless the user scrolled up.
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Extract all unique tags from the actual posts
    const allAvailableTags = useMemo(() => {
        const tagSet = new Set()
        posts.forEach(post => {
            if (post.tags) {
                if (Array.isArray(post.tags)) {
                    post.tags.forEach(t => tagSet.add(t))
                } else if (typeof post.tags === 'string') {
                    post.tags.split(',').forEach(t => tagSet.add(t.trim()))
                }
            }
        })
        return Array.from(tagSet)
    }, [posts])

    // Merge recommended tags with available ones to show as top suggestions
    const topTags = useMemo(() => {
        const availableRecommended = RECOMMENDED_TAGS.filter(tag => 
            allAvailableTags.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        const others = allAvailableTags.filter(tag => 
            !availableRecommended.some(t => t.toLowerCase() === tag.toLowerCase())
        )
        return [...availableRecommended, ...others].slice(0, 10) // Show top 10 tags
    }, [allAvailableTags])

    // Filter logic
    const filteredPosts = useMemo(() => {
        let result = [...posts]

        // 1. Sort by date descending
        result.sort((a, b) => {
            if (a.date < b.date) return 1
            if (a.date > b.date) return -1
            return 0
        })

        // 2. Search text
        if (search.trim() !== '') {
            const lowerSearch = search.toLowerCase()
            result = result.filter(post => 
                (post.title && post.title.toLowerCase().includes(lowerSearch)) ||
                (post.description && post.description.toLowerCase().includes(lowerSearch)) ||
                (post.excerpt && post.excerpt.toLowerCase().includes(lowerSearch))
            )
        }

        // 3. Filter by selected tags
        if (selectedTags.length > 0) {
            result = result.filter(post => {
                if (!post.tags) return false
                let postTags = []
                if (Array.isArray(post.tags)) {
                    postTags = post.tags.map(t => t.toLowerCase())
                } else if (typeof post.tags === 'string') {
                    postTags = post.tags.split(',').map(t => t.trim().toLowerCase())
                }
                // Must include at least one selected tag
                return selectedTags.some(st => postTags.includes(st.toLowerCase()))
            })
        }

        return result
    }, [posts, search, selectedTags])

    // Pagination logic
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const currentPosts = useMemo(() => {
        const start = (currentPage - 1) * postsPerPage
        return filteredPosts.slice(start, start + postsPerPage)
    }, [filteredPosts, currentPage])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [search, selectedTags])

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(prev => prev.filter(t => t !== tag))
        } else {
            setSelectedTags(prev => [...prev, tag])
        }
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Search and Filters */}
            <div className="bg-white dark:bg-dark-900 rounded-2xl p-4 md:p-6 border border-dark-200 dark:border-dark-800 shadow-sm space-y-6">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400 dark:text-dark-500" size={20} />
                    <input 
                        type="text" 
                        placeholder={t('buscarArticulos')}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-dark-900 dark:text-white transition-all"
                    />
                    {search && (
                        <button 
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600 dark:text-dark-500 dark:hover:text-dark-300 transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>

                {topTags.length > 0 && (
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => setShowMobileFilters(v => !v)}
                            aria-expanded={showMobileFilters}
                            className="flex md:pointer-events-none items-center justify-between w-full gap-2 text-sm font-medium text-dark-600 dark:text-dark-400"
                        >
                            <span className="flex items-center gap-2">
                                <FiFilter size={16} /> {t('filtrarPorTemas')}
                            </span>
                            <FiChevronDown size={16} className={`md:hidden transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`${showMobileFilters ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>
                            {topTags.map(tag => {
                                const isSelected = selectedTags.includes(tag)
                                return (
                                    <button
                                        key={tag}
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isSelected 
                                            ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20' 
                                            : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Results Info */}
            <div ref={resultsRef} className="flex justify-between items-center text-sm text-dark-500 dark:text-dark-400">
                <p>{language === 'en' ? `Showing ${currentPosts.length} of ${filteredPosts.length} articles` : `Mostrando ${currentPosts.length} de ${filteredPosts.length} artículos`}</p>
                {selectedTags.length > 0 && (
                    <button
                        onClick={() => setSelectedTags([])}
                        className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                    >
                        {t('limpiarFiltros')}
                    </button>
                )}
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {currentPosts.map((post) => (
                        <ArticleCard key={post?.slug} article={post} basePath={basePath} />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-dark-100 dark:bg-dark-900 mb-4">
                        <FiSearch size={24} className="text-dark-400 dark:text-dark-500" />
                    </div>
                    <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">{t('noSeEncontraronArticulos')}</h3>
                    <p className="text-dark-600 dark:text-dark-400 max-w-md mx-auto">
                        {t('intentaAjustarBusqueda')}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-8">
                    <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label={language === 'en' ? 'Previous page' : 'Página anterior'}
                        className="p-2 rounded-lg bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronLeft size={20} />
                    </button>

                    <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                        {language === 'en' ? `Page ${currentPage} of ${totalPages}` : `Página ${currentPage} de ${totalPages}`}
                    </span>

                    <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label={language === 'en' ? 'Next page' : 'Página siguiente'}
                        className="p-2 rounded-lg bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <FiChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    )
}
