-- Crear extensiones útiles si no existen
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla Profile (Configuración y Hero)
CREATE TABLE public.profile (
    id SERIAL PRIMARY KEY,
    hero_title_es TEXT NOT NULL DEFAULT 'Hola, soy Jaime',
    hero_title_en TEXT NOT NULL DEFAULT 'Hi, I am Jaime',
    hero_subtitle_es TEXT,
    hero_subtitle_en TEXT,
    hero_button1_text_es TEXT DEFAULT 'Ver Proyectos',
    hero_button1_text_en TEXT DEFAULT 'View Projects',
    hero_button1_link TEXT DEFAULT '/proyectos',
    hero_button2_text_es TEXT DEFAULT 'Contáctame',
    hero_button2_text_en TEXT DEFAULT 'Contact me',
    hero_button2_link TEXT DEFAULT '#contacto',
    about_me_es TEXT,
    about_me_en TEXT,
    stats_projects_completed INTEGER DEFAULT 350, -- Para el panel de estadísticas (+350 proyectos)
    cv_url TEXT,
    email TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar fila única de perfil inicial
INSERT INTO public.profile (id, email) VALUES (1, 'jaimetr1309@gmail.com');

-- 2. Tabla Projects
CREATE TABLE public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category TEXT DEFAULT 'Otros',
    rubro TEXT,
    technologies TEXT[] DEFAULT '{}',
    link_url TEXT,
    github_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla Experience
CREATE TABLE public.experience (
    id SERIAL PRIMARY KEY,
    role TEXT NOT NULL,
    role_en TEXT,
    company TEXT NOT NULL,
    company_en TEXT,
    description TEXT,
    description_en TEXT,
    date_string TEXT,
    date_en_string TEXT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT true, -- Para mostrar solo las seleccionadas en la web
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla Skills
CREATE TABLE public.skills (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'frontend', 'backend', 'learning', 'tools'
    icon_name TEXT NOT NULL,
    proficiency INTEGER DEFAULT 100,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla Posts (Blogs)
CREATE TABLE public.posts (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'published', -- 'draft', 'published'
    is_featured BOOLEAN DEFAULT false, -- Para mostrar en la Home
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla Messages (Bandeja de Contacto)
CREATE TABLE public.messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas de Lectura (Público)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profile FOR SELECT USING (true);
CREATE POLICY "Public projects are viewable by everyone." ON public.projects FOR SELECT USING (is_visible = true);
CREATE POLICY "Public experience is viewable by everyone." ON public.experience FOR SELECT USING (is_active = true);
CREATE POLICY "Public skills are viewable by everyone." ON public.skills FOR SELECT USING (true);
CREATE POLICY "Published posts are viewable by everyone." ON public.posts FOR SELECT USING (status = 'published');

-- Los mensajes solo los puede insertar el público, pero leer solo el admin
CREATE POLICY "Anyone can insert messages." ON public.messages FOR INSERT WITH CHECK (true);

-- Políticas de Escritura (Solo para autenticados)
-- Nota: En un entorno de Next.js, a menudo usamos el cliente de servicio (service_role) 
-- del lado del servidor para saltar RLS en rutas de API seguras, 
-- por lo que no es estrictamente necesario configurar políticas complejas de inserción si usamos la Service Key.
