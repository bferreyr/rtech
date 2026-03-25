import type { Metadata } from "next";
import styles from "./empresas.module.css";
import LeadForm from "./LeadForm";

export const metadata: Metadata = {
    title: "Soluciones IT para Empresas | Rincón TECH",
    description:
        "Equipamiento, redes, seguridad y asesoramiento IT para pymes y negocios en Santa Fe. Atención personalizada, respuesta rápida y precios competitivos.",
    keywords: [
        "IT empresas Santa Fe",
        "soporte informático pymes",
        "redes empresariales",
        "equipamiento oficinas",
        "seguridad informática",
        "Rincón TECH",
    ],
};

// ────────────────────────────────────────────────────────────
//  DATA
// ────────────────────────────────────────────────────────────

const pains = [
    { icon: "💻", title: "Equipos que fallan", desc: "PCs lentas o impresoras que no responden paralizan a tu equipo." },
    { icon: "📶", title: "Conectividad inestable", desc: "WiFi que se cae y reuniones que se cortan en el momento crítico." },
    { icon: "🆘", title: "Sin soporte técnico", desc: "Técnicos que tardan días y problemas que se arrastran semanas." },
    { icon: "🛒", title: "Compras sin criterio", desc: "Equipos que no cumplen lo que prometían o no escalan." },
    { icon: "🔓", title: "Datos desprotegidos", desc: "Sin backups ni antivirus gestionado. Un riesgo constante." },
    { icon: "⚡", title: "Cortes de energía", desc: "Bajones de tensión que queman componentes o dañan discos." },
];

const services = [
    {
        icon: "🖥️",
        title: "Equipamiento IT",
        items: ["PCs y notebooks profesionales", "Impresoras y multifuncionales", "Monitores y periféricos", "Servidores NAS y Workstations"],
        color: "blue",
    },
    {
        icon: "🌐",
        title: "Redes Profesionales",
        items: ["Diseño e instalación WiFi", "Cableado estructurado Cat 6", "VPN y acceso remoto seguro", "Switching gestionado"],
        color: "cyan",
    },
    {
        icon: "🔒",
        title: "Seguridad IT",
        items: ["Cámaras IP y sistemas CCTV", "Antivirus Centralizado", "Backup automático en la nube", "Control de accesos"],
        color: "violet",
    },
    {
        icon: "🔋",
        title: "Continuidad Eléctrica",
        items: ["UPS para servidores y PCs", "Reguladores de tensión", "Cálculo de autonomía", "Protección de datos"],
        color: "amber",
    },
    {
        icon: "🧠",
        title: "Asesoramiento IT",
        items: ["Diagnóstico inicial sin cargo", "Planificación de infraestructura", "Migración a la nube", "Consultoría de presupuesto"],
        color: "green",
    },
];

const cases = [
    {
        icon: "🏢",
        title: "Oficinas Modernas",
        challenge: "Sin red unificada y sin respaldo de datos centralizado.",
        solution: "Instalamos WiFi gestionado, servidor NAS y UPS. Cero caídas reportadas.",
        tag: "Networking + Datos",
    },
    {
        icon: "🏪",
        title: "Comercios y Locales",
        challenge: "Sistema de ventas lento y cámaras analógicas obsoletas.",
        solution: "Hardware nuevo, red optimizada para POS y CCTV IP con acceso móvil.",
        tag: "Hardware + Seguridad",
    },
    {
        icon: "🏭",
        title: "Pymes en Crecimiento",
        challenge: "Equipos que quedaron chicos al año de la compra.",
        solution: "Planificamos hardware escalable con soporte prioritario incluido.",
        tag: "Planificación IT",
    },
];

const differentials = [
    { icon: "🎯", title: "Asesoramiento Real", desc: "Primero preguntamos, después recomendamos la solución justa." },
    { icon: "⚡", title: "Respuesta en Horas", desc: "Atención directa con técnicos, sin intermediarios ni tickets." },
    { icon: "💰", title: "Precios Transparentes", desc: "Presupuestos claros y ajustados a tu presupuesto real." },
    { icon: "📍", title: "Locales y Cercanos", desc: "Estamos en Santa Fe. Si hace falta, vamos a tu empresa hoy." },
];

const steps = [
    { num: "01", title: "Contacto", desc: "Completás el formulario o nos hablás por WhatsApp." },
    { num: "02", title: "Diagnóstico", desc: "Analizamos tu situación actual sin cargo." },
    { num: "03", title: "Propuesta", desc: "Recibís un plan detallado y presupuesto claro." },
    { num: "04", title: "Ejecución", desc: "Implementamos con el menor impacto en tu operativa." },
];

const WA_NUMBER = "5493425444444";
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=Hola%20Rincón%20TECH!%20Necesito%20asesoramiento%20IT%20para%20mi%20empresa.`;

// ────────────────────────────────────────────────────────────
//  PAGE COMPONENT
// ────────────────────────────────────────────────────────────

export default function EmpresasPage() {
    return (
        <main className={styles.page}>

            {/* ── NAVBAR ── */}
            <nav className={styles.navbar}>
                <div className={styles.navInner}>
                    <a href="/" className={styles.logo}>
                        <span className={styles.logoIcon}>⚡</span>
                        <span className={styles.logoText}>RINCÓN <span className={styles.logoAccent}>TECH</span></span>
                    </a>
                    <div className={styles.navActions}>
                        <a href="#contacto" className={styles.navCta}>
                            Solicitar presupuesto
                        </a>
                    </div>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className={styles.hero} id="inicio">
                <div className={styles.heroBg} aria-hidden="true">
                    <div className={styles.heroBgGlow1} />
                    <div className={styles.heroBgGlow2} />
                    <div className={styles.heroBgGrid} />
                </div>

                <div className={styles.heroContent}>
                    <div className={styles.heroBadge}>
                        <span className={styles.heroBadgeDot} />
                        Santa Fe · Atención Regional Premium
                    </div>

                    <h1 className={styles.heroTitle}>
                        La tecnología de tu empresa{" "}
                        <span className={styles.heroTitleAccent}>sin fallas y sin vueltas</span>
                    </h1>

                    <p className={styles.heroSubtitle}>
                        Asesoramos, equipamos y protegemos el motor de tu negocio en Santa Fe y la región.
                        Soluciones IT inteligentes diseñadas para tu tamaño real.
                    </p>

                    <div className={styles.heroCtas}>
                        <a href="#contacto" className={styles.ctaPrimary}>
                            📋 Presupuesto sin cargo
                        </a>
                        <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={styles.ctaWhatsapp}>
                            💬 WhatsApp Directo
                        </a>
                    </div>

                    <div className={styles.heroTrust}>
                        <div className={styles.heroTrustItem}>✓ Diagnóstico sin costo</div>
                        <div className={styles.heroTrustItem}>✓ Respuesta en horas</div>
                        <div className={styles.heroTrustItem}>✓ Soporte presencial</div>
                    </div>
                </div>
            </section>

            {/* ── PROBLEMAS ── */}
            <section className={styles.section}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>¿Frustrado por la tecnología?</span>
                        <h2 className={styles.sectionTitle}>Problemas comunes, soluciones reales</h2>
                    </div>

                    <div className={styles.painsGrid}>
                        {pains.map((p) => (
                            <div key={p.title} className={styles.painCard}>
                                <span className={styles.painIcon}>{p.icon}</span>
                                <h3 className={styles.painTitle}>{p.title}</h3>
                                <p className={styles.painDesc}>{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SERVICIOS ── */}
            <section className={styles.section} id="servicios">
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Nuestras Soluciones</span>
                        <h2 className={styles.sectionTitle}>Todo lo que tu Pyme necesita</h2>
                    </div>

                    <div className={styles.servicesGrid}>
                        {services.map((s) => (
                            <div key={s.title} className={`${styles.serviceCard} ${styles[`serviceCard_${s.color}`]}`}>
                                <span className={styles.serviceIcon}>{s.icon}</span>
                                <h3 className={styles.serviceTitle}>{s.title}</h3>
                                <ul className={styles.serviceList}>
                                    {s.items.map((item) => (
                                        <li key={item}>
                                            <span className={styles.serviceListDot} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CASOS DE ÉXITO ── */}
            <section className={styles.casesSection} id="casos">
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <span className={styles.sectionEyebrow}>Casos Reales</span>
                        <h2 className={styles.sectionTitle}>Situaciones que resolvimos</h2>
                    </div>

                    <div className={styles.casesGrid}>
                        {cases.map((c) => (
                            <div key={c.title} className={styles.caseCard}>
                                <div className={styles.caseHeader}>
                                    <span className={styles.caseIcon}>{c.icon}</span>
                                    <span className={styles.caseTag}>{c.tag}</span>
                                </div>
                                <h3 className={styles.caseTitle}>{c.title}</h3>
                                <div className={styles.caseBlock}>
                                    <span className={styles.caseBlockLabel}>Desafío</span>
                                    <p className={styles.caseBlockText}>{c.challenge}</p>
                                </div>
                                <div className={`${styles.caseBlock} ${styles.caseBlockSolution}`}>
                                    <span className={styles.caseBlockLabel}>Solución</span>
                                    <p className={styles.caseBlockText}>{c.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PROCESO ── */}
            <section className={styles.section} id="proceso">
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Simple y sin vueltas</h2>
                    </div>

                    <div className={styles.stepsRow}>
                        {steps.map((s, i) => (
                            <div key={s.num} className={styles.stepItem}>
                                <div className={styles.stepNum}>{s.num}</div>
                                {i < steps.length - 1 && <div className={styles.stepConnector} />}
                                <h3 className={styles.stepTitle}>{s.title}</h3>
                                <p className={styles.stepDesc}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FORMULARIO ── */}
            <section className={styles.formSection} id="contacto">
                <div className={styles.container}>
                    <div className={styles.formWrapper}>
                        <div className={styles.formLeft}>
                            <span className={styles.sectionEyebrow}>Contacto Directo</span>
                            <h2 className={styles.formTitle}>
                                Contanos qué necesitás y te respondemos{" "}
                                <span className={styles.accentText}>hoy mismo</span>
                            </h2>
                            <p className={styles.formSubtitle}>
                                No vendemos paquetes cerrados. Diseñamos lo que tu negocio necesita para crecer.
                            </p>

                            <div className={styles.formTrustList}>
                                <div className={styles.formTrustItem}>✓ Datos 100% protegidos</div>
                                <div className={styles.formTrustItem}>✓ WhatsApp o Email, vos elegís</div>
                            </div>

                            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className={styles.whatsappAlt}>
                                💬 O hablá con un técnico ahora
                            </a>
                        </div>

                        <div className={styles.formRight}>
                            <LeadForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className={styles.footer}>
                <div className={styles.container}>
                    <div className={styles.footerInner}>
                        <div>
                            <span className={styles.logoText}>RINCÓN <span className={styles.logoAccent}>TECH</span></span>
                            <p className={styles.footerDesc}>Santa Fe, Argentina · Soluciones IT Profesionales</p>
                        </div>
                        <div className={styles.footerLinks}>
                            <a href="/">Tienda Online</a>
                            <a href="#servicios">Servicios</a>
                            <a href="#contacto">Contacto</a>
                        </div>
                    </div>
                    <div className={styles.footerBottom}>
                        <p>© {new Date().getFullYear()} Rincón TECH — Todos los derechos reservados</p>
                    </div>
                </div>
            </footer>

        </main>
    );
}
