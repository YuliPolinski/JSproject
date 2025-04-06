export type RefreshResponseType = {
    error: boolean;
    accessToken?: string | null;
    refreshToken?: string | null;
    message: string;
};