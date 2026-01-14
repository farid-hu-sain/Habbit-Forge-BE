import { errorResponse } from "../utils/response";
export const errorHandler = (err, _req, res, _next) => {
    console.error("ERROR:", err.message);
    const statusCode = err.message.includes("tidak ditemukan") ? 404 : 400;
    errorResponse(res, err.message || "terjadi kesalahan", statusCode, process.env.NODE_ENV === "development"
        ? { stack: err.stack }
        : null);
};
//# sourceMappingURL=error.handler.js.map