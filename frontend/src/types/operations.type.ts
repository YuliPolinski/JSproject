export type OperationsType = {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    comment: string;
    category?: string;
}

export type OperationRequestType = {
    type: 'income' | 'expense';
    // category_id: number;
    category: string;
    amount: number;
    date: string;
    comment?: string;
};

export type OperationResponseType = {
    id: number;
};