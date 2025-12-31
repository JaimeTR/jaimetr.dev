export const translations = {
    es: {
        // Navbar
        proyectos: 'Proyectos',
        experiencia: 'Experiencia',
        blog: 'Blog',
        contacto: 'Contacto',
        
        // Home Banner
        hola: 'Hola',
        soySoy: 'soy Jaime T.R',
        ingeniero: 'Ing de Sistemas | Fullstack | Web Developer',
        experiencia_anios: '+4 años de experiencia.',
        experiencia_desc: 'Ingeniero de Sistemas | Desarrollador Full-Stack | Web Developer WP',
        especializado: 'Especializado en crear soluciones Web profesionales y eficaces',
        dispuesto: 'Dispuesto a trabajar en tu proyecto y aportar mis habilidades.',
        linkedin: 'LinkedIn',
        github: 'GitHub',
        
        // Botones en Banner
        articulos: 'Artículos',
        
        // Experience
        experienciaSeccion: 'Experiencia',
        
        // About
        sobreMi: 'Sobre mí',
        holaYo: 'Hola 👋, soy Jaime Tarazona,',
        ingenieroSistemas: 'Ingeniero de Sistemas, Desarrollador Full-Stack',
        webDeveloper: 'Web Developer',
        experienciaAnios: 'con más de 4 años de experiencia',
        desarrollando: 'desarrollando desde páginas informativas y tiendas eCommerce hasta plataformas administrables,',
        garantizando: 'garantizando soluciones optimizadas y eficientes para distintos sectores y clientes.',
        
        unoPrincipal: 'Uno de mis principales proyectos es',
        inoia: 'InoIA',
        asistente: 'un asistente virtual con inteligencia artificial diseñado para mejorar la satisfacción de los pacientes.',
        ofrece: 'Ofrece chat a través de texto, voz y lectura de imágenes, permitiendo una interacción fluida y accesible. Todo el sistema está diseñado para brindar información clara, recomendaciones personalizadas y asistencia en cada etapa de la atención médica, optimizando la comunicación entre pacientes y profesionales de la salud con una experiencia intuitiva y eficiente.',
        
        tambienProyecto: 'Tambien como proyecto personal comparto',
        articulos_desc: 'artículos sobre temas de programacion, Inteligencia Artificial, desarrollo web y mucho más.',
        compartir: 'Cuando compartes tu conocimiento es cuando más aprendes y mi objetivo además de seguir mejorando mis habilidades es ayudar a otros con mis experiencias y guias.',
        
        ultimamente: 'Por último, comparto mi hoja de vida actualizada, donde de manera más detallada específico mi experiencia laboral, logros y formación académica.',
        
        // Projects
        misPro: 'Mis Proyectos',
        verProyecto: 'Ver Proyecto',
        mas: 'más',
        resumen: 'Resumen',
        descripcionProyecto: 'Descripción del proyecto',
        tecnologiasUsadas: 'Tecnologías usadas',
        tecnologia: 'Tecnología',
        uso: 'Uso',
        caracteristicasPrincipales: 'Características principales',
        galeria: 'Galería',
        irAlSitio: 'Ir al sitio',
        repo: 'Repo',
        
        // Blog
        misArticulos: 'Mis Artículos',
        leidos: 'artículos publicados',
        leerMas: 'Leer más',
        blogProgramacion: 'Blog de Programación',
        
        // Stack
        miStack: 'Mi Stack Tecnológico',
        
        // Footer
        derechos: 'Todos los derechos reservados',
        hecho: 'Hecho con',
        por: 'por Jaime Tarazona',
        
        // Common
        inicio: 'Inicio',
        cv: 'CV',
    },
    en: {
        // Navbar
        proyectos: 'Projects',
        experiencia: 'Experience',
        blog: 'Blog',
        contacto: 'Contact',
        
        // Home Banner
        hola: 'Hello',
        soySoy: "I'm Jaime T.R",
        ingeniero: 'Sys Engineer | Fullstack | Web Developer',
        experiencia_anios: '+4 years of experience.',
        experiencia_desc: 'Systems Engineer | Full-Stack Developer | Web Developer WP',
        especializado: 'Specialized in creating professional and efficient Web solutions',
        dispuesto: 'Ready to work on your project and contribute my skills.',
        linkedin: 'LinkedIn',
        github: 'GitHub',
        
        // Botones en Banner
        articulos: 'Articles',
        
        // Experience
        experienciaSeccion: 'Experience',
        
        // About
        sobreMi: 'About Me',
        holaYo: 'Hello 👋, I\'m Jaime Tarazona,',
        ingenieroSistemas: 'Systems Engineer, Full-Stack Developer',
        webDeveloper: 'Web Developer',
        experienciaAnios: 'with more than 4 years of experience',
        desarrollando: 'developing from informational pages and eCommerce stores to manageable platforms,',
        garantizando: 'guaranteeing optimized and efficient solutions for different sectors and clients.',
        
        unoPrincipal: 'One of my main projects is',
        inoia: 'InoIA',
        asistente: 'a virtual assistant with artificial intelligence designed to improve patient satisfaction.',
        ofrece: 'It offers chat through text, voice and image reading, allowing fluid and accessible interaction. The entire system is designed to provide clear information, personalized recommendations and assistance at each stage of medical care, optimizing communication between patients and healthcare professionals with an intuitive and efficient experience.',
        
        tambienProyecto: 'Also as a personal project I share',
        articulos_desc: 'articles on programming topics, Artificial Intelligence, web development and much more.',
        compartir: 'When you share your knowledge is when you learn the most and my objective besides continuing to improve my skills is to help others with my experiences and guides.',
        
        ultimamente: 'Finally, I share my updated resume, where I detail my work experience, achievements and academic training in more detail.',
        
        // Projects
        misPro: 'My Projects',
        verProyecto: 'View Project',
        mas: 'more',
        resumen: 'Summary',
        descripcionProyecto: 'Project description',
        tecnologiasUsadas: 'Technologies used',
        tecnologia: 'Technology',
        uso: 'Use',
        caracteristicasPrincipales: 'Main features',
        galeria: 'Gallery',
        irAlSitio: 'Go to site',
        repo: 'Repo',
        
        // Blog
        misArticulos: 'My Articles',
        leidos: 'articles published',
        leerMas: 'Read more',
        blogProgramacion: 'Programming Blog',
        
        // Stack
        miStack: 'My Tech Stack',
        
        // Footer
        derechos: 'All rights reserved',
        hecho: 'Made with',
        por: 'by Jaime Tarazona',
        
        // Common
        inicio: 'Home',
        cv: 'Resume',
    }
}

export const useTranslation = (language) => {
    return (key) => {
        return translations[language]?.[key] || translations['es'][key] || key
    }
}
