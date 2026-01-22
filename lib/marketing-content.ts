/**
 * Marketing content for RTECH.
 * Curated phrases that reflect a premium, technical, and high-performance aesthetic.
 */

export const HERO_TITLES = [
    "Próxima Generación de Hardware",
    "Domina el Futuro Digital",
    "Potencia Sin Compromisos",
    "Arquitectura del Mañana, Hoy",
    "El Epicentro del High-End",
    "Rendimiento en Estado Puro",
    "Tecnología que Rompe Límites"
];

export const HERO_SUBTITLES = [
    "Equipamiento de alto rendimiento para entusiastas y profesionales.",
    "Llevamos tu setup al siguiente nivel con componentes seleccionados.",
    "La vanguardia del hardware gamer y profesional en un solo lugar.",
    "Hardware certificado para los retos más exigentes del gaming moderno.",
    "No solo vendemos partes, construimos el corazón de tu estación de batalla."
];

export const CATALOG_TITLES = [
    "Catálogo de Productos",
    "Inventario Premium",
    "Nuestra Colección",
    "Hardware de Elite",
    "El Arsenal de RTECH"
];

export const CATALOG_SUBTITLES = [
    "Explora nuestra colección curada de hardware de alta gama.",
    "Componentes de alto rendimiento listos para ser parte de tu setup.",
    "La selección más exigente de hardware para los que no aceptan menos.",
    "Encontrá esa pieza que le falta a tu configuración perfecta."
];

export const BUILDER_TITLES = [
    "Armado de PC Gamers",
    "Crea tu Obra Maestra",
    "Ingeniería a Tu Medida",
    "Forjá tu Setup Legendario",
    "Configurador de Performance",
    "Tu Próxima Victoria Empieza Aquí"
];

export const BUILDER_SUBTITLES = [
    "Selecciona los mejores componentes para tu próximo equipo. Nosotros nos encargamos de que sea legendario.",
    "Elegí cada pieza con precisión quirúrgica. Armado por profesionales, para profesionales.",
    "El ADN de tu próxima computadora lo decidís vos. Nosotros lo hacemos realidad.",
    "Diseñá la máquina que siempre soñaste con stock real y compatibilidad garantizada."
];

export const ABOUT_TITLES = [
    "Elevando el Estándar del Hardware",
    "Nuestra Pasión: El Rendimiento",
    "RTECH: El ADN Tecnológico",
    "Expertos en ADN Hardware"
];

export const ABOUT_SUBTITLES = [
    "Pasión por la tecnología, compromiso con el rendimiento.",
    "Años de experiencia seleccionando lo mejor del mercado global.",
    "Nacimos para equipar a los que buscan la excelencia en cada frame."
];

/**
 * Returns a random item from a string array.
 */
export function getRandomContent(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
}
