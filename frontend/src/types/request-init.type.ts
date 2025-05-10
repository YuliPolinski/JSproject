export type RequestInitType = {
    method: string;
    headers: Record<string, string>;
    body?: string;
};