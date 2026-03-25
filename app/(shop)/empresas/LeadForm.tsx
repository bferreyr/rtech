'use client';

import { useState } from 'react';
import styles from "./empresas.module.css";

export default function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const form = e.currentTarget;
        const data = new FormData(form);
        const nombre = data.get("nombre");
        const empresa = data.get("empresa");
        const whatsapp = data.get("whatsapp");
        const necesidad = data.get("necesidad");

        // WhatsApp Number - Configuration
        const waNumber = "5493425444444"; // Placeholder for Rincón TECH Business WhatsApp

        const msg = encodeURIComponent(
            `🚀 *Nueva Consulta Empresarial - Rincón TECH*\n\n` +
            `*Nombre:* ${nombre}\n` +
            `*Empresa:* ${empresa || 'No especificada'}\n` +
            `*WhatsApp:* ${whatsapp}\n\n` +
            `*Necesidad:* ${necesidad}`
        );

        // Micro-interaction simulation
        setTimeout(() => {
            window.open(`https://wa.me/${waNumber}?text=${msg}`, "_blank");
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <form className={styles.form} id="lead-form" onSubmit={handleSubmit}>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label htmlFor="nombre" className={styles.formLabel}>Nombre</label>
                    <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="Tu nombre"
                        required
                        className={styles.formInput}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="empresa" className={styles.formLabel}>Empresa / Negocio</label>
                    <input
                        id="empresa"
                        name="empresa"
                        type="text"
                        placeholder="Nombre del negocio"
                        className={styles.formInput}
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="whatsapp" className={styles.formLabel}>WhatsApp de contacto</label>
                <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    placeholder="+54 9 342 XXX-XXXX"
                    required
                    className={styles.formInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="necesidad" className={styles.formLabel}>¿Qué podemos resolver por vos?</label>
                <textarea
                    id="necesidad"
                    name="necesidad"
                    rows={4}
                    placeholder="Contanos tu situación actual: qué falla, qué querés mejorar o qué equipamiento necesitás."
                    required
                    className={styles.formTextarea}
                />
                <span className={styles.formHint}>No hace falta tecnicismos, hablá con total confianza.</span>
            </div>

            <button
                type="submit"
                className={styles.formSubmit}
                id="form-submit-btn"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Procesando..." : "📋 Solicitar presupuesto sin cargo"}
            </button>

            <p className={styles.formMicrocopy}>
                ✓ Respuesta en menos de 24h · ✓ Diagnóstico inicial sin cargo
            </p>
        </form>
    );
}
