export declare const register: (data: {
    username: string;
    email: string;
    password: string;
}) => Promise<{
    email: string;
    username: string;
}>;
export declare const login: (data: {
    email: string;
    password: string;
}) => Promise<{
    userReturn: {
        email: string;
        username: string;
    };
    token: string;
}>;
export declare const getCurrentUser: (userId: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    profile: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string | null;
        bio: string | null;
        avatar: string | null;
    } | null;
    email: string;
    username: string;
}>;
//# sourceMappingURL=auth.service.d.ts.map