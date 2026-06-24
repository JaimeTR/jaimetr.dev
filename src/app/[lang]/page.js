import { About } from '@/components/Home/About'
import { Articles } from '@/components/Home/Articles'
import { Banner } from '@/components/Home/Banner'
import { Experience } from '@/components/Home/Experience'
import { Projects } from '@/components/Home/Projects'
import { Stack } from '@/components/Home/Stack'
import fs from 'fs'
import path from 'path'

const componentMap = {
    'profile': Banner,
    'aboutme': About,
    'experience': Experience,
    'project': Projects,
    'manage-blog': Articles,
    'skills': Stack
}

function getSections() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'sections.json')
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'))
        }
    } catch (e) {
        console.error('Error reading sections:', e)
    }
    // Fallback order
    return [
        { id: 'profile', is_hidden: false },
        { id: 'experience', is_hidden: false },
        { id: 'project', is_hidden: false },
        { id: 'aboutme', is_hidden: false },
        { id: 'manage-blog', is_hidden: false },
        { id: 'skills', is_hidden: false }
    ]
}

export default function Home() {
    const sections = getSections()

    return (
        <>
            <div className="absolute top-0 z-[-2] h-screen w-full bg-dark-50 dark:bg-dark-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(0,153,255,0.25),rgba(255,255,255,0))]"></div>
            {sections
                .filter(section => !section.is_hidden)
                .map(section => {
                    const Component = componentMap[section.id]
                    return Component ? <Component key={section.id} /> : null
                })
            }
        </>
    )
}
