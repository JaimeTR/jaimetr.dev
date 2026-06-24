export const SectionTitle = ({ children, className = '' }) => {
    return <h2 className={`text-3xl font-bold lg:text-5xl text-dark-700 dark:text-dark-200 ${className}`}>{children}</h2>
}
