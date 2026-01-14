export declare const register: (data: import("./user.service").RegisterData) => Promise<{
    user: import("./user.service").UserProfile;
    token: string;
}>;
export declare const login: (data: import("./user.service").LoginData) => Promise<{
    user: import("./user.service").UserProfile;
    token: string;
}>;
export declare const getCurrentUser: (userId: string) => Promise<import("./user.service").UserProfile>;
//# sourceMappingURL=auth.service.d.ts.map