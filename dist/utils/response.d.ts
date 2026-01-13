import type { Response } from "express";
export declare const successResponse: (res: Response, message: string, data?: unknown, pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
} | null, statusCode?: number) => Response<any, Record<string, any>>;
export declare const errorResponse: (res: Response, message: string, statusCode?: number, errors?: Array<{
    field: string;
    message: string;
}> | {
    stack?: string;
} | null) => Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map