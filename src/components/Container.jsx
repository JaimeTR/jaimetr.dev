export const Container = ({ children, id = '', className = '' }) => {
    return (
        <section className={`min-h-screen flex flex-col justify-center pt-24 pb-12 container mx-auto px-4 ${className || 'lg:max-w-[740px]'}`} id={id}>
            {children}
        </section>
    )
}
