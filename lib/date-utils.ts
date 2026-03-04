/**
 * Date formatting utilities with explicit Argentina timezone (America/Argentina/Buenos_Aires).
 * Always use these helpers instead of raw toLocaleDateString / toLocaleTimeString
 * to ensure correct display regardless of the server's system timezone (which may be UTC).
 */

const TZ = 'America/Argentina/Buenos_Aires';
const LOCALE = 'es-AR';

/**
 * Format: "04/03/2026"
 */
export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString(LOCALE, { timeZone: TZ });
}

/**
 * Format: "16:37"
 */
export function formatTime(date: Date | string): string {
    return new Date(date).toLocaleTimeString(LOCALE, {
        timeZone: TZ,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format: "04/03/2026 a las 16:37"
 */
export function formatDateTime(date: Date | string): string {
    return `${formatDate(date)} a las ${formatTime(date)}`;
}

/**
 * Format for chart axis label: "mar. 26"
 */
export function formatMonthYear(date: Date | string): string {
    return new Date(date).toLocaleDateString(LOCALE, {
        timeZone: TZ,
        month: 'short',
        year: '2-digit',
    });
}

/**
 * Format: "04 mar 2026, 16:37"
 */
export function formatFull(date: Date | string): string {
    return new Date(date).toLocaleString(LOCALE, {
        timeZone: TZ,
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Returns current time in Argentina as a string "HH:MM"
 */
export function nowTimeAR(): string {
    return formatTime(new Date());
}
