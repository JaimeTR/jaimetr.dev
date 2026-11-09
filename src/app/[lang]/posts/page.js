import { Banner } from '@/components/Banner'
import { FilteredPosts } from '@/components/Articles/FilteredPosts'
import { articulosDelErp } from '@/lib/erp'
export const revalidate=600
export async function generateMetadata({params}) { const {lang}=await params; return {title: (lang==='en'?'Programming Blog':'Blog de programaci?n')+' | Jaime Tarazona Rodriguez', alternates:{canonical:'https://jaimetr.dev/'+lang+(lang==='es'?'/articulos':'/posts'),languages:{es:'https://jaimetr.dev/es/articulos',en:'https://jaimetr.dev/en/posts'}}} }
export default async function PostsPage({params}) { const {lang}=await params; const posts=await articulosDelErp(lang); return <><Banner title={lang==='en'?'Programming Blog':'Blog de programaci?n'} image='/images/bloggin.png'/><section className="pt-24 container mx-auto px-4 lg:px-8 max-w-[1200px]"><FilteredPosts posts={posts.map(p=>({...p,title:p.titulo,description:p.resumen,cover:p.imagen,date:p.publicadoEn,tags:p.etiquetas}))} basePath={lang==='en'?'/en/posts':'/es/articulos'}/></section></> }
