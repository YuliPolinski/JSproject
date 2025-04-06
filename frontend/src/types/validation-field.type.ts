export type ValidationFieldType = {
    element: HTMLInputElement | HTMLTextAreaElement;
    options?: {
        pattern?: RegExp;
        compareTo?: string;
    };
}