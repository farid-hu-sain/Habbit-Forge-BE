/**
 * Parse "2024-01-15" → Date UTC
 */
export const parseDateFromFE = (dateString) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        throw new Error(`Format tanggal tidak valid: ${dateString}`);
    }
    const parts = dateString.split("-");
    // Pastikan ada 3 parts
    if (parts.length !== 3) {
        throw new Error(`Format tanggal tidak valid: ${dateString}`);
    }
    const yearStr = parts[0];
    const monthStr = parts[1];
    const dayStr = parts[2];
    // Validasi tidak kosong
    if (!yearStr || !monthStr || !dayStr) {
        throw new Error(`Format tanggal tidak valid: ${dateString}`);
    }
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    // Validasi angka
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        throw new Error(`Tanggal tidak valid: ${dateString}`);
    }
    // Validasi bulan (1-12)
    if (month < 1 || month > 12) {
        throw new Error(`Bulan tidak valid: ${month}`);
    }
    // Validasi tanggal (1-31)
    if (day < 1 || day > 31) {
        throw new Error(`Tanggal tidak valid: ${day}`);
    }
    // Buat Date di UTC
    return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};
/**
 * Format Date → "2024-01-15" string
 */
export const formatDateForFE = (date) => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
export const addDays = (dateString, days) => {
    const date = parseDateFromFE(dateString);
    date.setUTCDate(date.getUTCDate() + days);
    return formatDateForFE(date);
};
/**
 * Get yesterday's date string (UTC)
 */
export const getYesterdayDateString = () => {
    return addDays(getTodayDateString(), -1);
};
/**
 * Get today's date in UTC "2024-01-15"
 */
export const getTodayDateString = () => {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
/**
 * Get date range for query (UTC start/end of day)
 */
export const getDateRangeForQuery = (dateString) => {
    const start = parseDateFromFE(dateString);
    const end = new Date(start);
    end.setUTCHours(23, 59, 59, 999);
    return { start, end };
};
/**
 * Validate date string format
 */
export const isValidDateString = (dateString) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString))
        return false;
    try {
        parseDateFromFE(dateString);
        return true;
    }
    catch {
        return false;
    }
};
/**
 * Get today's date range (backward compatibility)
 */
export const getTodayRange = () => {
    return getDateRangeForQuery(getTodayDateString());
};
export const formatToIndonesianDate = (utcDate) => {
    return utcDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    });
};
